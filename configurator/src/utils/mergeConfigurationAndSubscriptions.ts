import { TFetchConfigurationItem } from '../hooks/use-custom-object-connector/use-custom-object-connectors';
import { TSubscriptionReturn } from '../hooks/use-subscriptions-connector/types';

export type TTwilioConfigurationItem = {
  id: string;
  type: string;
  subject: string;
  useCustomIdentity?: boolean;
  customIdentity?: string;
  body: string;
  predicate?: string;
  messages?: string[];
};

export const mergeConfigurationAndSubscriptions = (
  configuration?: TFetchConfigurationItem[],
  subscriptions?: TSubscriptionReturn
): TTwilioConfigurationItem[] => {
  const configs = configuration?.map((item) => ({
    ...item,
    messages: subscriptions?.subscription?.messages?.filter(
      (message) => message.includes(item.type)
    ),
  })) || [];
  
  const missingSubscriptions = subscriptions?.subscription?.messages?.filter(
    (message) => !configuration?.find((config) => config.type === message)
  ).map((message) => ({
    id: message,
    type: message,
    subject: "",
    body: "",
    predicate: "",
    messages: [message],
  })) || [];

  return [...configs, ...missingSubscriptions]

};
