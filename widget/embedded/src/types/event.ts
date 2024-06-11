import type { SelectedQuote } from './quote';
import type { BlockchainMeta } from 'rango-sdk';

export enum WidgetEvents {
  QuoteEvent = 'quoteEvent',
  WalletEvent = 'walletEvent',
}

export enum QuoteEventTypes {
  FROM_BLOCKCHAIN_CHANGED = 'fromBlockchainChanged',
  FROM_TOKEN_CHANGED = 'fromTokenChanged',
  TO_BLOCKCHAIN_CHANGED = 'toBlockchainChanged',
  TO_TOKEN_CHANGED = 'toTokenChanged',
  INPUT_AMOUNT_CHANGED = 'inputAmountChanged',
  SELECTED_QUOTE_CHANGED = 'selectedQuoteChanged',
}

export enum WalletEventTypes {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

export type Event<
  T extends QuoteEventTypes,
  U extends Record<string, unknown> = Record<string, unknown>
> = {
  type: T;
} & U;

export type FromBlockchainChangeEvent = Event<
  QuoteEventTypes.FROM_BLOCKCHAIN_CHANGED,
  {
    blockchain?: BlockchainMeta;
  }
>;

export type FromTokenChangeEvent = Event<
  QuoteEventTypes.FROM_TOKEN_CHANGED,
  {
    token?: string;
  }
>;

export type ToBlockchainChangeEvent = Event<
  QuoteEventTypes.TO_BLOCKCHAIN_CHANGED,
  {
    blockchain?: BlockchainMeta;
  }
>;

export type ToTokenChangeEvent = Event<
  QuoteEventTypes.TO_TOKEN_CHANGED,
  {
    token?: string;
  }
>;

export type InputAmountChangeEvent = Event<
  QuoteEventTypes.INPUT_AMOUNT_CHANGED,
  {
    amount: string;
  }
>;

export type SelectedQuoteChangeEvent = Event<
  QuoteEventTypes.SELECTED_QUOTE_CHANGED,
  {
    selectedQuote: SelectedQuote | null;
  }
>;

export type QuoteEvent =
  | FromBlockchainChangeEvent
  | FromTokenChangeEvent
  | ToBlockchainChangeEvent
  | ToTokenChangeEvent
  | InputAmountChangeEvent
  | SelectedQuoteChangeEvent;

export type WalletEvent =
  | WalletEventTypes.CONNECTED
  | WalletEventTypes.DISCONNECTED;

export type QuoteEventData = { event: QuoteEvent };

export type WalletEventData = { event: WalletEvent };

export type Events = {
  [WidgetEvents.QuoteEvent]: QuoteEventData;
  [WidgetEvents.WalletEvent]: WalletEventData;
};
