import React, { ChangeEvent } from 'react';
import { TSubscriptionMessageDraft } from '../../hooks/use-subscriptions-connector/types';
import SpacingsInline from '@commercetools-uikit/spacings-inline';

import SelectField from '@commercetools-uikit/select-field';

type Props = {
  message: TSubscriptionMessageDraft;
  onUpdate: (value: TSubscriptionMessageDraft) => void;
};

const SubscriptionRow: React.FC<Props> = ({ message, onUpdate }) => {
  const handleUpdate = (value?: string | string[] | null, name?: string) => {
    if (!name) {
      return;
    }
    onUpdate({
      ...message,
      [name]: value,
    });
  };

  return (
    <SpacingsInline scale="m" alignItems='stretch'>
      <SelectField
        name="resourceTypeId"
        title="Resource Type Id"
        value={message.resourceTypeId}
        onChange={(e) => handleUpdate(e.target.value, e.target.name)}
        options={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ]}
      />
      <SelectField
        title="Types"
        name="types"
        isMulti
        value={message.types}
        onChange={(e) => handleUpdate(e.target.value, e.target.name)}
        options={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ]}
      />
    </SpacingsInline>
  );
};

export default SubscriptionRow;
