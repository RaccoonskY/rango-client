import type { SwapInputProps } from './SwapInput.types';

import { i18n } from '@lingui/core';
import React from 'react';

import { Divider, PriceImpact, Skeleton, Typography } from '../../components';

import {
  amountStyles,
  balanceStyles,
  Container,
  formStyles,
  InputAmount,
  labelContainerStyles,
  labelStyles,
  MaxButton,
  textStyles,
  UsdPrice,
  ValueTypography,
} from './SwapInput.styles';
import { TokenSection } from './TokenSection';

export function SwapInput(props: SwapInputProps) {
  const showBalance =
    'balance' in props && !props.loading && !props.loadingBalance;
  const showBalanceSkeleton =
    'balance' in props && (props.loading || props.loadingBalance);
  return (
    <Container sharpBottomStyle={props.sharpBottomStyle}>
      <div className={labelContainerStyles()}>
        <div className={labelStyles()}>
          <Typography variant="body" size="small" className={textStyles()}>
            {props.label}
          </Typography>
          {showBalance && (
            <div className={balanceStyles()}>
              <Typography
                className={textStyles()}
                mr={4}
                variant="body"
                size="xsmall">
                {i18n.t('Balance')}: {props.balance}
              </Typography>
              <MaxButton
                variant="default"
                size="xsmall"
                onClick={props.onSelectMaxBalance}>
                <Typography variant="body" size="xsmall" color="secondary500">
                  {i18n.t('Max')}
                </Typography>
              </MaxButton>
            </div>
          )}
          {showBalanceSkeleton && (
            <div className={balanceStyles()}>
              <Skeleton variant="text" size="large" width={105} />
            </div>
          )}
        </div>
      </div>
      <div className={formStyles()}>
        <TokenSection
          chain={props.chain.displayName}
          tokenSymbol={props.token.displayName}
          error={props.error}
          chainImage={props.chain.image}
          tokenImage={props.token.image}
          onClick={props.onClickToken}
          loading={props.loading}
        />
        <div className={amountStyles()}>
          {props.loading || (props.mode === 'To' && props.fetchingQuote) ? (
            <>
              <Skeleton variant="text" size="large" />
              <Divider size={8} />
              <Skeleton variant="text" size="medium" />
            </>
          ) : (
            <>
              <InputAmount
                disabled={props.disabled || props.mode === 'To'}
                style={{ padding: 0 }}
                value={props.price.value}
                type={'onInputChange' in props ? 'number' : 'text'}
                size="large"
                placeholder="0"
                variant="ghost"
                min={0}
                {...('onInputChange' in props && {
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                    props.onInputChange(event.target.value),
                })}
              />
              {'percentageChange' in props ? (
                <PriceImpact
                  size="large"
                  outputUsdValue={props.price.usdValue}
                  error={props.price.error}
                  percentageChange={props.percentageChange}
                  warningLevel={props.warningLevel}
                />
              ) : (
                <ValueTypography hasWarning={!!props.price.error}>
                  <UsdPrice variant="body" size="medium">
                    {props.price.usdValue
                      ? `~$${props.price.usdValue}`
                      : props.price.error}
                  </UsdPrice>
                </ValueTypography>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
