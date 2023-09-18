import type { PropTypes } from './RouteErrors.types';

import { Alert, InfoIcon } from '@rango-dev/ui';
import React from 'react';

import { errorMessages } from '../../constants/errors';
import { useBestRouteStore } from '../../store/bestRoute';
import { hasLimitError, LimitErrorMessage } from '../../utils/swap';

import { Action, Alerts } from './RouteErrors.styles';
import { RouteErrorsModal } from './RouteErrorsModal';

const WARNING_LEVEL_LIMIT = -10;

export function RouteErrors(props: PropTypes) {
  const { bestRoute } = useBestRouteStore();
  const {
    highValueLoss,
    percentageChange,
    priceImpactCanNotBeComputed,
    openModal,
    onToggle,
    totalFeeInUsd,
    outputUsdValue,
    inputUsdValue,
  } = props;
  const error = hasLimitError(bestRoute);
  const { recommendation } = LimitErrorMessage(bestRoute);

  return (
    <>
      <Alerts>
        {!error && (highValueLoss || priceImpactCanNotBeComputed) && (
          <>
            <Alert
              title={
                highValueLoss
                  ? errorMessages.highValueLossError.title
                  : errorMessages.unknownPriceError.title
              }
              type={
                highValueLoss && !!percentageChange?.lt(WARNING_LEVEL_LIMIT)
                  ? 'error'
                  : 'warning'
              }
              variant="alarm"
              action={
                <Action onClick={() => onToggle(true)}>
                  <InfoIcon size={12} color="gray" />
                </Action>
              }
            />
          </>
        )}
        {error && <Alert type="error" variant="alarm" title={recommendation} />}
      </Alerts>
      <RouteErrorsModal
        highValueLoss={highValueLoss}
        open={openModal}
        onToggle={onToggle}
        percentageChange={percentageChange}
        inputUsdValue={inputUsdValue}
        outputUsdValue={outputUsdValue}
        totalFeeInUsd={totalFeeInUsd}
      />
    </>
  );
}
