/* eslint-disable @typescript-eslint/no-explicit-any */
import { extractMessageType, isMessageTypeSupported } from '../message';
import { SUPPORTED_MESSAGE_TYPES } from '../message-types';
import { initializeTwilio } from '../twilio';

export const initializeClient = (() => {
    return initializeTwilio().then((c) => c);
  })();
const findConversation = async (client: any, identity: any) => {
  console.log('getting conv');
  try {
    const conversation = await client.getConversationByUniqueName(identity);
    return conversation;
  } catch {
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
    console.log('No client');
    return;
  }
  const client = await clientPromise;

  let conversation = await findConversation(client, identity);
  if (!conversation) {
    console.log('no conversation found');
    conversation = await createConversation(client, identity);
  }
  const participantsCount = await conversation.getParticipantsCount();
  if (participantsCount < 2) {
    try {
      await conversation.add(identity);
      console.log('added customer');
    } catch {
      console.log('customer already exists');
    }
    try {
      await conversation.join();
      console.log('joined my self');
    } catch {
      console.log("I'm already there");
    }
  }

  console.log('sending message');
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
  const getNotificationBody =
    SUPPORTED_MESSAGE_TYPES[messageType].getNotificationBody;
  const getNotificationSubject =
    SUPPORTED_MESSAGE_TYPES[messageType].getNotificationSubject;
  return {
    body: getNotificationBody(message),
    subject: getNotificationSubject(message),
  };
};
