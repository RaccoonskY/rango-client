import React, { useState } from 'react';
import { styled } from '../../theme';
import { BlockchainMeta } from 'rango-sdk';
import { Button } from '../Button/Button';
import { FilledCircle } from '../common';
import { Typography } from '../Typography';

export interface PropTypes {
  list: BlockchainMeta[];
  selected?: BlockchainMeta | null;
  onChange: (blockchain: BlockchainMeta) => void;
  multiSelect?: boolean;
  selectedList?: BlockchainMeta[] | 'all';
}

const ListContainer = styled('div', {
  display: 'grid',
  gap: '.5rem',
  gridTemplateColumns: ' repeat(2, minmax(0, 1fr))',
  alignContent: 'baseline',
  width: '100%',
  height: '100%',
});

const Image = styled('img', {
  width: '1.5rem',
  maxHeight: '1.5rem',
  marginRight: '$4',
});

export function BlockchainsList(props: PropTypes) {
  const { list, onChange, multiSelect, selectedList } = props;
  const [selected, setSelected] = useState(props.selected);

  const changeSelectedBlockchain = (blockchain: BlockchainMeta) => {
    setSelected(blockchain);
    onChange(blockchain);
  };

  const isSelect = (name: string) => {
    if (multiSelect && selectedList) {
      if (selectedList === 'all') return true;
      else {
        const index = selectedList.map((item) => item.name).indexOf(name);
        if (index !== -1) return true;
      }
    } else if (name === selected?.name) return true;
    return false;
  };

  return (
    <ListContainer>
      {list.map((blockchain, index) => {
        return (
          <Button
            type={isSelect(blockchain.name) ? 'primary' : undefined}
            variant="outlined"
            size="large"
            prefix={<Image src={blockchain.logo} />}
            suffix={isSelect(blockchain.name) ? <FilledCircle /> : undefined}
            align="start"
            onClick={changeSelectedBlockchain.bind(null, blockchain)}
            key={index}
          >
            <Typography variant="body2">{blockchain.displayName}</Typography>
          </Button>
        );
      })}
    </ListContainer>
  );
}
