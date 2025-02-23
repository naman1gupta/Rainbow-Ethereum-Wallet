import lang from 'i18n-js';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '../components/alerts';
import { isNativeAsset } from '@/handlers/assets';
import { greaterThan, toFixedDecimals } from '@/helpers/utilities';
import { useGas } from '@/hooks';
import { AppState } from '@/redux/store';
import { updateSwapInputAmount, updateSwapNativeAmount, updateSwapOutputAmount } from '@/redux/swap';
import { ethereumUtils } from '@/utils';

export default function useSwapInputHandlers() {
  const dispatch = useDispatch();

  const { selectedGasFee, l1GasFeeOptimism } = useGas();

  const inputCurrency = useSelector((state: AppState) => state.swap.inputCurrency);

  const updateMaxInputAmount = useCallback(() => {
    const inputCurrencyAddress = inputCurrency?.address;
    const inputCurrencyUniqueId = inputCurrency?.uniqueId;
    const inputCurrencyNetwork = inputCurrency?.network;

    const accountAsset = ethereumUtils.getAccountAsset(inputCurrencyUniqueId);
    const oldAmount = accountAsset?.balance?.amount ?? '0';
    let newAmount = oldAmount;
    if (isNativeAsset(inputCurrencyAddress, inputCurrencyNetwork) && accountAsset) {
      // this subtracts gas from the balance of the asset
      newAmount = toFixedDecimals(ethereumUtils.getBalanceAmount(selectedGasFee, accountAsset, l1GasFeeOptimism), 6);

      if (greaterThan(newAmount, 0)) {
        dispatch(updateSwapInputAmount(newAmount));
      } else {
        Alert({
          message: lang.t('expanded_state.swap.swap_max_insufficient_alert.message', { symbol: accountAsset.symbol }),
          title: lang.t('expanded_state.swap.swap_max_insufficient_alert.title', { symbol: accountAsset.symbol }),
        });
        return;
      }
    }
    dispatch(updateSwapInputAmount(newAmount, true));
  }, [dispatch, inputCurrency?.address, inputCurrency?.network, inputCurrency?.uniqueId, l1GasFeeOptimism, selectedGasFee]);

  const updateInputAmount = useCallback(
    (value: string | null) => {
      dispatch(updateSwapInputAmount(value));
    },
    [dispatch]
  );

  const updateNativeAmount = useCallback(
    (value: string | null) => {
      dispatch(updateSwapNativeAmount(value));
    },
    [dispatch]
  );

  const updateOutputAmount = useCallback(
    (value: string | null) => {
      dispatch(updateSwapOutputAmount(value));
    },
    [dispatch]
  );

  return {
    updateInputAmount,
    updateMaxInputAmount,
    updateNativeAmount,
    updateOutputAmount,
  };
}
