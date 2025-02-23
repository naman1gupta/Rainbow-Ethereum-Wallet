import { Contract } from '@ethersproject/contracts';
import { isEmpty } from 'lodash';
import { web3Provider } from './web3';
import { metadataClient } from '@/graphql';
import { RainbowTransaction, TransactionStatus, ZerionTransaction } from '@/entities';
import store from '@/redux/store';
import { transactionSignaturesDataAddNewSignature } from '@/redux/transactionSignatures';
import { SIGNATURE_REGISTRY_ADDRESS, signatureRegistryABI } from '@/references';
import { ethereumUtils } from '@/utils';
import { fetchWalletENSAvatars, fetchWalletNames } from '@/redux/wallets';
import { RainbowFetchClient } from '@/rainbow-fetch';
import { IS_TEST } from '@/env';
import { API_BASE_URL } from '@rainbow-me/swaps';
import { logger, RainbowError } from '@/logger';

const flashbotsApi = new RainbowFetchClient({
  baseURL: 'https://protect.flashbots.net',
});

const rainbowSwapsApi = new RainbowFetchClient({
  baseURL: API_BASE_URL,
});

const parseSignatureToTitle = (signature: string) => {
  const rawName = signature.match(/^([^)(]*)\((.*)\)([^)(]*)$/u);
  let parsedName = '';

  if (rawName) {
    parsedName =
      rawName[1].charAt(0).toUpperCase() +
      rawName[1]
        .slice(1)
        .split(/(?=[A-Z])/u)
        .join(' ');
  }
  return parsedName;
};

const timeoutPromise = new Promise((_, reject) => {
  setTimeout(reject, 800);
});

export const getTransactionMethodName = async (transaction: ZerionTransaction) => {
  try {
    const { signatures } = store.getState().transactionSignatures;
    // only being used on mainnet transactions, so we can use the default web3 provider
    const txn = await web3Provider.getTransaction(transaction.hash);
    const bytes = txn?.data?.substring(0, 10) || '';
    let signature = signatures[bytes] || '';
    if (signature) return signature;
    try {
      const data = await metadataClient.getContractFunction({
        chainID: 1,
        hex: bytes,
      });

      if (data.contractFunction && !isEmpty(data?.contractFunction?.text)) {
        signature = data.contractFunction.text;
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
    if (!signature) {
      try {
        const contract = new Contract(SIGNATURE_REGISTRY_ADDRESS, signatureRegistryABI, web3Provider!);
        signature = await Promise.race([contract.entries(bytes), timeoutPromise]);
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
    const parsedSignature = parseSignatureToTitle(signature);
    store.dispatch(transactionSignaturesDataAddNewSignature(parsedSignature, bytes));
    return parsedSignature;
  } catch (e) {
    return '';
  }
};

type FlashbotsStatus = 'PENDING' | 'INCLUDED' | 'FAILED' | 'CANCELLED' | 'UNKNOWN';

export const getTransactionFlashbotStatus = async (
  transaction: RainbowTransaction,
  txHash: string
): Promise<{
  flashbotsStatus: 'FAILED' | 'CANCELLED' | 'UNKNOWN';
  status: 'failed';
  minedAt: number;
  title: string;
} | null> => {
  try {
    const fbStatus = await flashbotsApi.get<{ status: FlashbotsStatus }>(`/tx/${txHash}`);
    const flashbotsStatus = fbStatus.data.status;
    // Make sure it wasn't dropped after 25 blocks or never made it
    if (flashbotsStatus === 'FAILED' || flashbotsStatus === 'CANCELLED' || flashbotsStatus === 'UNKNOWN') {
      const status = 'failed';
      const minedAt = Math.floor(Date.now() / 1000);
      const title = `${transaction.type}.failed`;
      return { flashbotsStatus, status, minedAt, title };
    }
  } catch (e) {
    //
  }
  return null;
};
export const getTransactionSocketStatus = async (pendingTransaction: RainbowTransaction) => {
  const { swap } = pendingTransaction;
  const txHash = ethereumUtils.getHash(pendingTransaction);
  let pending = true;
  const minedAt: number | null = Math.floor(Date.now() / 1000);
  let status = swap?.isBridge ? TransactionStatus.bridging : TransactionStatus.swapping;
  try {
    const socketStatus = await rainbowSwapsApi.get('/v1/bridge-status', {
      params: {
        txHash: txHash || '',
        fromChainId: String(swap?.fromChainId),
        toChainId: String(swap?.toChainId),
      },
    });
    const socketResponse = socketStatus.data;
    if (socketResponse.success) {
      if (socketResponse?.result?.sourceTxStatus === 'COMPLETED') {
        status = swap?.isBridge ? TransactionStatus.bridging : TransactionStatus.swapping;
      }
      if (socketResponse?.result?.DestinationTxStatus === 'COMPLETED') {
        status = swap?.isBridge ? TransactionStatus.bridged : TransactionStatus.swapped;
        pending = false;
      }
      if (socketResponse?.result?.DestinationTxStatus === 'FAILED' || socketResponse?.result?.sourceTxStatus === 'FAILED') {
        status = TransactionStatus.failed;
        pending = false;
      }
    } else if (socketResponse.error) {
      logger.warn('getTransactionSocketStatus transaction check failed', socketResponse.error);
      status = TransactionStatus.failed;
      pending = false;
    }
  } catch (e) {
    logger.error(new RainbowError('getTransactionSocketStatus transaction check caught'));
    if (IS_TEST) {
      status = swap?.isBridge ? TransactionStatus.bridged : TransactionStatus.swapped;
      pending = false;
    }
  }

  return { status, minedAt, pending };
};

export const fetchWalletENSDataAfterRegistration = async () => {
  await store.dispatch(fetchWalletENSAvatars());
  store.dispatch(fetchWalletNames());
};
