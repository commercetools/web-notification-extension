import React, { useMemo, useState } from 'react';
import { TTwilioConfigurationItem } from '../../utils/mergeConfigurationAndSubscriptions';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { PlusThinIcon } from '@commercetools-uikit/icons';
import messages from './messages';
import { useIntl } from 'react-intl';
import {
  CustomFormModalPage,
  FormModalPage,
  PageContentWide,
  ConfirmationDialog,
  useModalState,
} from '@commercetools-frontend/application-components';
import Spacings from '@commercetools-uikit/spacings';
import CreateSubscription from '../subscription/create';
type Props = {
  item: TTwilioConfigurationItem & { [key: string]: boolean };
};

const tableAction: React.FC<Props> = ({ item }) => {
  const hasMessages: boolean = useMemo(() => !!item.messages?.length, [item]);
  const hasBody: boolean = useMemo(() => !!item.body?.length, [item]);
  const hasSubject: boolean = useMemo(() => !!item.subject?.length, [item]);
  const intl = useIntl();

  const [isShown, setIsShown] = useState(false);

  return (
    <>
      <div>
        {!hasMessages && (
          <PrimaryButton
            size="small"
            iconLeft={<PlusThinIcon size="small" />}
            label={intl.formatMessage(messages.createMessageButton)}
            onClick={() => setIsShown(true)}
            isDisabled={false}
          />
        )}
        <FormModalPage
          isOpen={isShown}
          level={0}
          onClose={() => setIsShown(false)}
          shouldDelayOnClose={true}
          title={intl.formatMessage(messages.fixSubscriptionTitle)}
          onPrimaryButtonClick={() => alert('Button clicked')}
          onSecondaryButtonClick={() => alert('Button clicked')}
          
        >
          <Spacings.Stack scale="xxxl">
              <h3>{intl.formatMessage(messages.fixSubscriptionInfoTitle)}</h3>
              <h4>{intl.formatMessage(messages.fixSubscriptionInfoDetails)}</h4>
              <CreateSubscription />
          </Spacings.Stack>
        </FormModalPage>
      </div>
    </>
  );
};

export default tableAction;
