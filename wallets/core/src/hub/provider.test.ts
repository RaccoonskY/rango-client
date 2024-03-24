import type { Provider } from './provider';
import type { Store } from './store';
import type { EvmActions } from '../actions/evm/interface';
import type { SolanaActions } from '../actions/solana/interface';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { garbageWalletInfo } from '../test-utils/fixtures';

import { BlockchainProviderBuilder } from './blockchain';
import { ProviderBuilder } from './provider';
import { createStore } from './store';

describe('providers', () => {
  let blockchainProviders: {
    evm: BlockchainProviderBuilder<EvmActions>;
    solana: BlockchainProviderBuilder<SolanaActions>;
  };
  let store: Store;

  beforeEach(() => {
    store = createStore();
    const evmBlockchain = new BlockchainProviderBuilder<EvmActions>().config(
      'namespace',
      'eip155'
    );
    const solanaBlockchain =
      new BlockchainProviderBuilder<SolanaActions>().config(
        'namespace',
        'solana'
      );

    blockchainProviders = {
      evm: evmBlockchain,
      solana: solanaBlockchain,
    };

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      blockchainProviders = undefined;
    };
  });

  test('Initialize providers correctly', () => {
    const builder = new ProviderBuilder('garbage').config(
      'info',
      garbageWalletInfo
    );
    const { evm, solana } = blockchainProviders;
    builder.add('evm', evm.build()).add('solana', solana.build());
    const wallet = builder.build();

    const allProviders = wallet.getAll();
    expect(allProviders.size).toBe(2);
  });

  test('updating states', () => {
    const builder = new ProviderBuilder('garbage').config(
      'info',
      garbageWalletInfo
    );
    const { evm, solana } = blockchainProviders;
    builder.add('evm', evm.build()).add('solana', solana.build());

    const wallet = builder.build().store(store);
    const [getState, setState] = wallet.state();
    setState('installed', true);
    const isInstalled = getState('installed');
    expect(isInstalled).toBe(true);
  });

  test('run actions', async () => {
    const builder = new ProviderBuilder('garbage').config(
      'info',
      garbageWalletInfo
    );
    const { evm, solana } = blockchainProviders;
    solana.action('connect', async () => [
      '0x000000000000000000000000000000000000dead',
    ]);
    builder.add('evm', evm.build()).add('solana', solana.build());

    const wallet = builder.build().store(store);
    const result = await wallet.get('solana').connect();

    expect(result).toStrictEqual([
      '0x000000000000000000000000000000000000dead',
    ]);
    // Since we didn't add any action regarding connect for `evm`
    expect(() => wallet.get('evm').connect('0x1')).toThrowError();
  });

  test('sets config properly', () => {
    const builder = new ProviderBuilder('garbage');
    builder.config('info', garbageWalletInfo);
    const wallet = builder.build().store(store);

    expect(wallet.info()).toStrictEqual(garbageWalletInfo);
  });

  test('.init should works on Provider', () => {
    const builder = new ProviderBuilder('garbage').config(
      'info',
      garbageWalletInfo
    );
    let count = 0;
    builder.init(() => {
      count++;
    });
    const wallet = builder.build().store(store);
    expect(count).toBe(0);
    wallet.init();
    wallet.init();
    wallet.init();
    expect(count).toBe(1);
  });

  test(".init shouldn't do anything when use hasn't set anything", () => {
    const builder = new ProviderBuilder('garbage').config(
      'info',
      garbageWalletInfo
    );
    const wallet = builder.build().store(store);
    expect(() => {
      wallet.init();
      wallet.init();
      wallet.init();
    }).not.toThrow();
  });

  test('A provider can be found using its namespace', () => {
    const builder = new ProviderBuilder('garbage').config(
      'info',
      garbageWalletInfo
    );
    const { evm, solana } = blockchainProviders;
    builder.add('evm', evm.build()).add('solana', solana.build());
    const wallet = builder.build().store(store);

    const result = wallet.findBy({
      namespace: 'solana',
    });
    expect(result).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    expect(result?.namespace).toBe('solana');

    const result2 = wallet.findBy({
      namespace: 'whatever',
    });
    expect(result2).toBeUndefined();
  });

  test('`before/after` is calling with correct context ', () => {
    const connect = vi.fn();
    const before = vi.fn(function (this: Provider) {
      const [, setState] = this.state();
      setState('installed', true);
    });
    const after = vi.fn(function (this: Provider) {
      const [, setState] = this.state();
      setState('installed', false);
    });

    const { evm } = blockchainProviders;
    const evmBlockchain = evm.action('connect', connect).build();

    const builder = new ProviderBuilder('garbage')
      .add('evm', evmBlockchain)
      .config('info', garbageWalletInfo);
    const wallet = builder.build().store(store);

    const [getState] = wallet.state();
    const result = wallet.get('evm');

    // Adding `after` then make it will run
    wallet.before('connect', before);
    result.connect('whatever');

    expect(connect).toBeCalledTimes(1);
    expect(before).toBeCalledTimes(1);
    expect(getState('installed')).toBe(true);

    // Adding `after` then make it will run
    wallet.after('connect', after);
    result.connect('whatever');
    expect(connect).toBeCalledTimes(2);
    expect(after).toBeCalledTimes(1);

    expect(getState('installed')).toBe(false);
  });
});
