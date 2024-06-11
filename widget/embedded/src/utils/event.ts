import type { SelectedQuote, Wallet } from '../types';
import type { WalletType } from '@rango-dev/wallets-shared';
import type { BlockchainMeta, Token } from 'rango-sdk';

import {
  QuoteEventTypes,
  WalletEventTypes,
  WidgetEvents,
} from '../types/event';

export function getQuoteSpecificEventEmitter(
  eventEmitter: any,
  eventType: QuoteEventTypes.FROM_BLOCKCHAIN_CHANGED
): (blockchain: BlockchainMeta | null) => void;
export function getQuoteSpecificEventEmitter(
  eventEmitter: any,
  eventType: QuoteEventTypes.FROM_TOKEN_CHANGED
): (token: Token | null) => void;
export function getQuoteSpecificEventEmitter(
  eventEmitter: any,
  eventType: QuoteEventTypes.TO_BLOCKCHAIN_CHANGED
): (blockchain: BlockchainMeta | null) => void;
export function getQuoteSpecificEventEmitter(
  eventEmitter: any,
  eventType: QuoteEventTypes.TO_TOKEN_CHANGED
): (token: Token | null) => void;
export function getQuoteSpecificEventEmitter(
  eventEmitter: any,
  eventType: QuoteEventTypes.INPUT_AMOUNT_CHANGED
): (amount: string | null) => void;
export function getQuoteSpecificEventEmitter(
  eventEmitter: any,
  eventType: QuoteEventTypes.SELECTED_QUOTE_CHANGED
): (quote: SelectedQuote | null) => void;
export function getQuoteSpecificEventEmitter(
  eventEmitter: any,
  eventType: QuoteEventTypes
) {
  switch (eventType) {
    case QuoteEventTypes.FROM_BLOCKCHAIN_CHANGED:
      return (blockchain: BlockchainMeta | null) => {
        eventEmitter.emit(WidgetEvents.QuoteEvent, {
          event: {
            type: QuoteEventTypes.FROM_BLOCKCHAIN_CHANGED,
            blockchain,
          },
        });
      };
    case QuoteEventTypes.FROM_TOKEN_CHANGED:
      return (token: Token | null) => {
        eventEmitter.emit(WidgetEvents.QuoteEvent, {
          event: {
            type: QuoteEventTypes.FROM_TOKEN_CHANGED,
            token,
          },
        });
      };
    case QuoteEventTypes.TO_BLOCKCHAIN_CHANGED:
      return (blockchain: BlockchainMeta | null) => {
        eventEmitter.emit(WidgetEvents.QuoteEvent, {
          event: {
            type: QuoteEventTypes.TO_BLOCKCHAIN_CHANGED,
            blockchain,
          },
        });
      };
    case QuoteEventTypes.TO_TOKEN_CHANGED:
      return (token: Token | null) => {
        eventEmitter.emit(WidgetEvents.QuoteEvent, {
          event: {
            type: QuoteEventTypes.TO_TOKEN_CHANGED,
            token,
          },
        });
      };
    case QuoteEventTypes.INPUT_AMOUNT_CHANGED:
      return (amount: string | null) => {
        eventEmitter.emit(WidgetEvents.QuoteEvent, {
          event: {
            type: QuoteEventTypes.INPUT_AMOUNT_CHANGED,
            amount,
          },
        });
      };
    case QuoteEventTypes.SELECTED_QUOTE_CHANGED:
      return (quote: SelectedQuote | null) => {
        eventEmitter.emit(WidgetEvents.QuoteEvent, {
          event: {
            type: QuoteEventTypes.SELECTED_QUOTE_CHANGED,
            selectedQuote: quote,
          },
        });
      };
    default:
      throw new Error('Invalid quote event type');
  }
}

export function getWalletSpecificEventEmitter(
  eventEmitter: any,
  eventType: WalletEventTypes.CONNECTED
): (walletType: WalletType, accounts: Wallet[]) => void;
export function getWalletSpecificEventEmitter(
  eventEmitter: any,
  eventType: WalletEventTypes.DISCONNECTED
): (walletType: WalletType) => void;
export function getWalletSpecificEventEmitter(
  eventEmitter: any,
  eventType: WalletEventTypes
) {
  switch (eventType) {
    case WalletEventTypes.CONNECTED:
      return (walletType: WalletType, accounts: Wallet[]) => {
        eventEmitter.emit(WidgetEvents.WalletEvent, {
          event: {
            type: WalletEventTypes.CONNECTED,
            walletType,
            accounts,
          },
        });
      };
    case WalletEventTypes.DISCONNECTED:
      return (walletType: WalletType) => {
        eventEmitter.emit(WidgetEvents.WalletEvent, {
          event: {
            type: WalletEventTypes.DISCONNECTED,
            walletType,
          },
        });
      };
    default:
      throw new Error('Invalid wallet event type');
  }
}
