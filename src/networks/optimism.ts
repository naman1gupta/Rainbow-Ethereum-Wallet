import { getProviderForNetwork, proxyRpcEndpoint } from '@/handlers/web3';
import { Network, NetworkProperties } from './types';
import { gasUtils } from '@/utils';
import { optimism } from '@wagmi/chains';
import { OPTIMISM_ETH_ADDRESS } from '@/references';
import { getOptimismGasPrices } from '@/redux/gas';
import { getRemoteConfig } from '@/model/remoteConfig';

export const getOptimismNetworkObject = (): NetworkProperties => {
  const { optimism_enabled, optimism_tx_enabled, op_chains_enabled, op_chains_tx_enabled } = getRemoteConfig();
  return {
    // wagmi chain data
    ...optimism,

    // network related data
    enabled: optimism_enabled && op_chains_enabled,
    name: 'Optimism',
    longName: 'Optimism',
    value: Network.optimism,
    networkType: 'layer2',
    blockTimeInMs: 5_000,

    nativeCurrency: {
      ...optimism.nativeCurrency,
      address: OPTIMISM_ETH_ADDRESS,
    },

    rpc: () => proxyRpcEndpoint(optimism.id),
    getProvider: () => getProviderForNetwork(Network.optimism),
    balanceCheckerAddress: '0x1C8cFdE3Ba6eFc4FF8Dd5C93044B9A690b6CFf36',

    // features
    features: {
      txHistory: true,
      flashbots: false,
      walletconnect: true,
      swaps: true,
      nfts: true,
      pools: false,
      txs: optimism_tx_enabled && op_chains_tx_enabled,
    },

    gas: {
      speeds: [gasUtils.NORMAL, gasUtils.FAST, gasUtils.URGENT, gasUtils.CUSTOM],

      // ?
      gasType: 'eip1559',
      roundGasDisplay: true,
      OptimismTxFee: true,

      // this prob can just be blockTime,
      pollingIntervalInMs: 5_000,

      getGasPrices: getOptimismGasPrices,
    },

    swaps: {
      defaultSlippage: 200,
    },

    nfts: { simplehashNetwork: 'optimism' },

    // design tings
    colors: {
      light: '#FF4040',
      dark: '#FF6A6A',
    },
  };
};
