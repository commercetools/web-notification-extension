import {
  CloudEventsPayload,
  MessagePayload,
} from '@commercetools/platform-sdk';
import { SUPPORTED_MESSAGE_TYPES } from '../message-types';
import { logger } from '../utils/logger.utils';
import {
  IdentityExtractor,
  PayloadIntersection,
} from '../interfaces/message.interface';

export const extractMessageType = (message: MessagePayload) => {
  if (!message.type) {
    return null;
  }
  return message.type;
};

export const isMessageTypeSupported = (messageType: string) => {
  return Object.keys(SUPPORTED_MESSAGE_TYPES).includes(messageType);
};

const predicatePassed = (message: MessagePayload, messageType: string) => {
  if (!SUPPORTED_MESSAGE_TYPES[messageType].predicate) {
    return true;
  }
  return SUPPORTED_MESSAGE_TYPES[messageType].predicate?.(
    message as PayloadIntersection
  );
};

export const extractIdentity = async (message: MessagePayload) => {
  const messageType = extractMessageType(message);
  if (!messageType) {
    return null;
  }
  if (!isMessageTypeSupported(messageType)) {
    return null;
  }
  if (!predicatePassed(message, messageType)) {
    logger.info('predicate failed');
    return null;
  }
  const identityExtractor: IdentityExtractor =
    SUPPORTED_MESSAGE_TYPES[messageType].identityExtractor;
  const identity = await identityExtractor(message as PayloadIntersection);
  return identity;
};

export const parseMessage = (data: CloudEventsPayload) => {
  return data.data;
};
