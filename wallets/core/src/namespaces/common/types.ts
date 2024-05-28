import type { SpecificMethods } from '../../hub/namespace';
import type { NamespacesWithDiscoverMode } from '../../legacy/types';

export enum Namespaces {
  Solana = 'solana',
  Evm = 'evm',
  Cosmos = 'cosmos',
  Utxo = 'utxo',
}
interface NamespaceNetworkType {
  [Namespaces.Evm]: string;
  [Namespaces.Solana]: undefined;
  [Namespaces.Cosmos]: string;
  [Namespaces.Utxo]: string;
}

export type NetworkTypeForNamespace<T extends NamespacesWithDiscoverMode> =
  T extends 'DISCOVER_MODE'
    ? string
    : T extends Namespaces
    ? NamespaceNetworkType[T]
    : never;
/*
 * export type NetworkTypeForNamespace<T extends NamespacesWithDiscoverMode> =
 *   T extends 'DISCOVER_MODE'
 *     ? string
 *     : T extends Namespaces
 *     ? NamespaceNetworkType[T]
 *     : never;
 */

export type AnyFunction = (...args: any[]) => any;

export type FunctionWithContext<T, C> = T extends (...args: infer P) => infer R
  ? (context: C, ...args: P) => R
  : never;

export type VoidReturn<T> = T extends (...args: infer P) => any
  ? (...args: P) => void
  : never;

export type Task<T extends SpecificMethods<T>> = readonly [
  keyof T,
  FunctionWithContext<T[keyof T], unknown>
];

export type TaskWithVoidReturn<T extends SpecificMethods<T>> = readonly [
  keyof T,
  VoidReturn<FunctionWithContext<T[keyof T], any>>
];

// TODO: TS could evaluate a pattern on string as well. template literal type, I guess.
export type Accounts = string[];
export type AccountsWithActiveChain = {
  accounts: Accounts;
  network: string;
};

export interface CommonActions {
  init: () => void;
}

export interface AutoImplementedActionsByRecommended {
  disconnect: () => void;
}
