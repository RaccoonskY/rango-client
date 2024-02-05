import type { PropTypes } from './ActivateTabModal.types';

import { i18n } from '@lingui/core';
import { Button, Divider, MessageBox, Modal } from '@rango-dev/ui';
import React from 'react';

import { useUiStore } from '../../../store/ui';
import { getContainer } from '../../../utils/common';

export function ActivateTabModal(props: PropTypes) {
  const { open, onClose, onConfirm } = props;
  const { watermark } = useUiStore();

  const hasWatermark = watermark === 'FULL';

  return (
    <Modal
      hasWatermark={hasWatermark}
      open={open}
      dismissible
      onClose={onClose}
      container={getContainer()}>
      <MessageBox
        title={i18n.t('Activate current tab')}
        type="warning"
        description={i18n.t(
          'Currently, some transactions are running and being handled by other browser tab. If you activate this tab, all transactions that are already in the transaction sign step will expire.'
        )}>
        <Divider size={20} />
        <Button
          variant="contained"
          size="large"
          type="primary"
          fullWidth
          onClick={onConfirm}>
          {i18n.t('Confirm')}
        </Button>
      </MessageBox>
    </Modal>
  );
}
