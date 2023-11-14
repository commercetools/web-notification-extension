/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Message } from '@commercetools/platform-sdk';
import {
  MessageTypeReturn,
  PayloadIntersection,
  SupportedMessageTypes,
  SupportedMessageTypeMap,
} from '../interfaces/message.interface';
import { MapMessageTypeToObjectEndpoint } from './constants';
import { getCustomerReferenceCallback } from './referenceUtilities';
import { getMessagesConfiguration } from './supportedMessageFetcher';

let SUPPORTED_MESSAGE_TYPES: SupportedMessageTypeMap;

const createSupportedMessageTypes = (
  type: SupportedMessageTypes
): MessageTypeReturn | null => {
  const messagesConfigs = getMessagesConfiguration();
  const configItem = messagesConfigs.find((message) => message.type === type);
  if (!configItem) {
    return null;
  }
  const { object, endpoint } = MapMessageTypeToObjectEndpoint[type];

  const messageBuilder: MessageTypeReturn = {
    identityExtractor: async (message: PayloadIntersection) => {
      if (configItem.useCustomIdentity && configItem.customIdentity) {
        return configItem.customIdentity;
      }
      const customerEmail = await getCustomerReferenceCallback(
        message,
        object,
        endpoint
      );
      return customerEmail;
    },
    getNotificationBody: (message?: Message) => {
      return configItem.body.replace('{{id}}', message?.resource?.id || '');
    },
    getNotificationSubject: (message?: Message) => {
      return configItem.subject.replace('{{id}}', message?.resource?.id || '');
    },
  };
  if (configItem.predicate) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messageBuilder.predicate = (message: Message) =>
      eval(configItem.predicate!);
  }
  return messageBuilder;
};

const initializeMessageTypes = () => {
  SUPPORTED_MESSAGE_TYPES = {};
  Object.keys(MapMessageTypeToObjectEndpoint).forEach((key) => {
    SUPPORTED_MESSAGE_TYPES[key] = createSupportedMessageTypes(
      key as SupportedMessageTypes
    );
  });
};

export const getSupportedMessageTypes = () => {
  if (!SUPPORTED_MESSAGE_TYPES) {
    initializeMessageTypes();
  }
  return SUPPORTED_MESSAGE_TYPES;
};
