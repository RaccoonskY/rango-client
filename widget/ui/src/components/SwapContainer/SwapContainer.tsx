import type { CSSProperties } from '@stitches/react';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { styled } from '../../theme';

const MainContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  borderRadius: '$xl',
  boxShadow: '15px 15px 15px 0px rgba(0, 0, 0, 0.05)',

  minWidth: '375px',
  maxWidth: '390px',
  boxSizing: 'border-box',
  backgroundColor: '$surface100',
  overflow: 'hidden',
  '& *': {
    boxSizing: 'border-box',
    listStyleType: 'none',
    '&::-webkit-scrollbar': { width: 2, height: '$8' },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '$sm',
      backgroundColor: '$neutral300',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '$neutral500',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '$neutral100',
    },
  },
  variants: {
    fixedHeight: {
      true: {},
      false: {
        height: 'auto',
      },
    },
  },
});

export interface PropTypes {
  style?: CSSProperties;
  fixedHeight?: boolean;
}

export function SwapContainer(props: PropsWithChildren<PropTypes>) {
  const { children, style, fixedHeight = true } = props;
  return (
    <MainContainer style={style} id="swap-box" fixedHeight={fixedHeight}>
      {children}
    </MainContainer>
  );
}
