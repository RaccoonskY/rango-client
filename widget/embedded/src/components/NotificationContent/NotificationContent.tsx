import type { Notification } from '../../types/notification';

import { Notifications } from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';
import { useAppStore } from '../../store/AppStore';
import { useNotificationStore } from '../../store/notification';
import { getBlockchainImage, getTokenImage } from '../../utils/meta';

export function NotificationContent() {
  const navigate = useNavigate();

  const { getNotifications, clearNotifications } = useNotificationStore();

  const notifications: Notification[] = getNotifications();
  const blockchains = useAppStore().blockchains();
  const tokens = useAppStore().tokens();
  const sortedNotifications = notifications.sort(
    (a, b) => b.creationTime - a.creationTime
  );

  const onClickItem = (requestId: Notification['requestId']) => {
    navigate(`${navigationRoutes.swaps}/${requestId}`);
  };

  return (
    <Notifications
      list={sortedNotifications}
      getBlockchainImage={(blockchain) =>
        getBlockchainImage(blockchain, blockchains) || ''
      }
      getTokenImage={(token) => getTokenImage(token, tokens) || ''}
      onClickItem={onClickItem}
      onClearAll={clearNotifications}
    />
  );
}
