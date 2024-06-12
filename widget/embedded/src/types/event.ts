import type { SelectedQuote } from './quote';
import type { Wallet } from './wallets';

import { MainEvents as QueueManagerEvents } from '@rango-dev/queue-manager-rango-preset';

type Account = Wallet;

export enum MainEvents {
  RouteEvent = QueueManagerEvents.RouteEvent,
  StepEvent = QueueManagerEvents.StepEvent,
  QuoteEvent = 'quoteEvent',
  WalletEvent = 'walletEvent',
}

export enum QuoteEventTypes {
  QUOTE_INPUT_UPDATE = 'quoteInputUpdate',
  QUOTE_UPDATE = 'quoteUpdate',
}

export enum WalletEventTypes {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

export type QuoteInputUpdateEventPayload = {
  fromBlockchain?: string;
  toBlockchain?: string;
  fromToken?: { symbol: string; name: string | null; address: string | null };
  toToken?: { symbol: string; name: string | null; address: string | null };
  requestAmount?: string;
};

export type QuoteUpdateEventPayload = Pick<
  SelectedQuote,
  'requestAmount' | 'swaps' | 'outputAmount' | 'resultType' | 'tags'
>;

export type ConnectWalletEventPayload = {
  walletType: string;
  accounts: Account[];
};

export type DisconnectWalletEventPayload = {
  walletType: string;
};

export type QuoteEventData =
  | {
      type: QuoteEventTypes.QUOTE_INPUT_UPDATE;
      payload: QuoteInputUpdateEventPayload;
    }
  | {
      type: QuoteEventTypes.QUOTE_UPDATE;
      payload: QuoteUpdateEventPayload;
    };

export type WalletEventData =
  | {
      type: WalletEventTypes.CONNECTED;
      payload: ConnectWalletEventPayload;
    }
  | {
      type: WalletEventTypes.DISCONNECTED;
      payload: DisconnectWalletEventPayload;
    };

export type Events = {
  [MainEvents.QuoteEvent]: QuoteEventData;
  [MainEvents.WalletEvent]: WalletEventData;
};
