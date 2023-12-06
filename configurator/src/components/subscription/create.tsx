import React, { useState } from 'react';
import { TSubscriptionMessageDraft } from '../../hooks/use-subscriptions-connector/types';
import { useIntl } from 'react-intl';
import messages from './messages';
import SubscriptionRow from './subscription-row';
import { FieldArray, Formik } from 'formik';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import SpacingsStack from '@commercetools-uikit/spacings-stack';

type Props = {
  onUpdate?: () => void;
};

type SubscriptionData = {
  messages: (TSubscriptionMessageDraft & { id: string })[];
};

const CreateSubscription: React.FC = ({}) => {
  const [data, setData] = useState<SubscriptionData>({
    messages: [],
  });
  // const [subscriptionMessages, setSubscriptionMessages] = useState<
  //   (TSubscriptionMessageDraft & { id: string })[]
  // >([]);
  const intl = useIntl();

  const addSubscription = () => {};


  // const updateMessage = (
  //   id: string,
  //   updatedMessage: TSubscriptionMessageDraft
  // ) => {
  //   setSubscriptionMessages(
  //     subscriptionMessages.map((message) => {
  //       if (message.id === id) {
  //         return { ...message, ...updatedMessage };
  //       }
  //       return message;
  //     })
  //   );
  // };
  return (
    <div>
      <Formik initialValues={data} onSubmit={() => {}}>
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <FieldArray name="messages">
              {(fieldArrayProps) => (
                <SpacingsStack scale="m" alignItems="flex-start">
                  <SecondaryButton
                    iconLeft={<PlusBoldIcon />}
                    label={intl.formatMessage(messages.addRow)}
                    onClick={() => fieldArrayProps.push({
                      resourceTypeId: "",
                      types: [],
                    })}
                  />
                  {formik.values.messages.map((message, i) => (
                    <SubscriptionRow
                      key={message.id}
                      message={message}
                      onUpdate={(value) => fieldArrayProps.form.setFieldValue(`messages.${i}`, value)}
                    />
                  ))}
                </SpacingsStack>
              )}
            </FieldArray>

            <button type="submit">Submit</button>
          </form>
        )}
      </Formik>
      {/* 
      {subscriptionMessages.map((message) => (
        <SubscriptionRow message={message} onUpdate={(updatedMessage: TSubscriptionMessageDraft) => updateMessage(message.id, updatedMessage)} />
      ))} */}
    </div>
  );
};

export default CreateSubscription;
