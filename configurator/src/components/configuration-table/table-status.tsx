import { CheckActiveIcon, WarningIcon } from '@commercetools-uikit/icons';
import React, { useMemo } from 'react';
import { TTwilioConfigurationItem } from '../../utils/mergeConfigurationAndSubscriptions';

type Props = {
  item: TTwilioConfigurationItem & { [key: string]: boolean };
};
const TableStatus: React.FC<Props> = ({ item }) => {
  const status: boolean = useMemo(
    () => !!item.messages?.length && !!item.body?.length && !!item.subject?.length,
    [item]
  );
  return status ? <CheckActiveIcon /> : <WarningIcon />;
};

export default TableStatus;
