import type { Transaction, VersionedTransaction } from '@solana/web3.js';

import { SignerError, SignerErrorCode } from 'rango-types';

import { getSolanaConnection } from './helpers';

const INSTRUCTION_INDEX = 4;
const INSUFFICIENT_FUNDS_ERROR_CODE = 0x1;
const SLIPPAGE_ERROR_CODE = 0x1771;
const PROGRAM_FAILED_TO_COMPLETE_ERROR = 'ProgramFailedToComplete';

export async function simulateTransaction(
  tx: Transaction | VersionedTransaction,
  type: 'VERSIONED' | 'LEGACY'
) {
  if (type === 'VERSIONED') {
    const connection = getSolanaConnection();

    // We first simulate whether the transaction would be successful
    const { value: simulatedTransactionResponse } =
      await connection.simulateTransaction(tx as VersionedTransaction, {
        replaceRecentBlockhash: true,
        commitment: 'processed',
      });
    const { err, logs } = simulatedTransactionResponse;
    if (err) {
      /*
       * Simulation error, we can check the logs for more details
       * If you are getting an invalid account error, make sure that you have the input mint account to actually swap from.
       */
      console.error('Simulation Error:', { err, logs });

      throw getSimulationError(err, logs);
    }
  }
}

function getSimulationError(error: any, logs: string[] | null) {
  let message =
    (logs?.length || 0) > 0 ? logs?.[logs?.length - 1] : JSON.stringify(error);

  /*
   * trying to detect common errors (e.g. insufficient fund or slippage error)
   * We could probably remove this code after upgrading solana/web3 lib to v2
   */
  if (typeof error === 'object' && error?.InstructionError) {
    if (
      error?.InstructionError?.[0] === INSTRUCTION_INDEX &&
      typeof error?.InstructionError?.[1] === 'object'
    ) {
      if (
        error?.InstructionError?.[1]?.Custom === INSUFFICIENT_FUNDS_ERROR_CODE
      ) {
        const insufficentLamportErrorMessage = logs?.find((log) =>
          log.toLowerCase()?.includes('insufficient lamports')
        );

        message = insufficentLamportErrorMessage
          ? insufficentLamportErrorMessage
          : 'Insufficient funds';
      } else if (error?.InstructionError?.[1]?.Custom === SLIPPAGE_ERROR_CODE) {
        message = 'Slippage error';
      }
    } else if (
      error?.InstructionError?.[1] === PROGRAM_FAILED_TO_COMPLETE_ERROR
    ) {
      message = 'Program failed to complete';
    } else {
      message = 'Custom program error';
    }
  } else if (typeof error === 'object' && error?.InsufficientFundsForRent) {
    message =
      'Transaction results in an account with insufficient funds for rent.';
  } else if (error === 'AccountNotFound') {
    message =
      'Attempt to debit an account but found no record of a prior credit.';
  }

  return new SignerError(
    SignerErrorCode.SEND_TX_ERROR,
    undefined,
    `Simulation failed: ${message}`
  );
}
