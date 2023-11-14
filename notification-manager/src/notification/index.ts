/* eslint-disable @typescript-eslint/no-explicit-any */
import { extractMessageType, isMessageTypeSupported } from '../message';
import { getSupportedMessageTypes } from '../message-types';
import { initializeTwilio } from '../twilio';
import { logger } from '../utils/logger.utils';

export const initializeClient = (() => {
  return initializeTwilio().then((c) => c);
})();
const findConversation = async (client: any, identity: any) => {
  logger.info('findConversation');
  try {
    const conversation = await client.getConversationByUniqueName(identity);
    return conversation;
  } catch {
    logger.info('get conversation error');
    return null;
  }
};

const createConversation = async (client: any, identity: any) => {
  return client.createConversation({
    attributes: {},
    friendlyName: `Notifications to ${identity}`,
    uniqueName: identity,
  });
};

export const sendNotification = async (
  clientPromise: any,
  message: any,
  identity: any
) => {
  if (!clientPromise) {
    logger.info('No client promise');
    return;
  }
  const client = await clientPromise;

  let conversation = await findConversation(client, identity);
  if (!conversation) {
    logger.info('no conversation found, creating one');
    conversation = await createConversation(client, identity);
  }
  logger.info('conversation found!');

  try {
    await conversation.add(identity);
    logger.info('added customer');
  } catch {
    logger.info('customer already exists');
  }
  try {
    await conversation.join();
    logger.info('joined my self');
  } catch {
    logger.info("I'm already there");
  }

  logger.info('sending message');
  await conversation.sendMessage(message.body, { subject: message.subject });
};
exports.sendNotification = sendNotification;

export const createNotification = async (message: any) => {
  const messageType = extractMessageType(message);
  if (!messageType) {
    return null;
  }
  if (!isMessageTypeSupported(messageType)) {
    return null;
  }
  const supportedMesageTypes = getSupportedMessageTypes();

  const getNotificationBody =
    supportedMesageTypes[messageType]?.getNotificationBody;
  const getNotificationSubject =
    supportedMesageTypes[messageType]?.getNotificationSubject;
  return {
    body: getNotificationBody?.(message),
    subject: getNotificationSubject?.(message),
  };
};
