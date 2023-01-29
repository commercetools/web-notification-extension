const { SUPPORTED_MESSAGE_TYPES } = require("./message-types");
const { sendNotification } = require("./notification");
const { initialize } = require("./twilio-client");

const clientPromise = (() => {
  return initialize().then((c) => c);
})();


const parseMessage = (data) => {
  const pubSubMessage = data;
  const message = pubSubMessage.data
    ? Buffer.from(pubSubMessage.data, "base64").toString()
    : undefined;
  return message && JSON.parse(message);
};

const extractMessageType = (message) => {
  if (!message.type) {
    return null;
  }
  return message.type;
};

const predicatePassed = (message, messageType) => {
  console.log(SUPPORTED_MESSAGE_TYPES[messageType].predicate);
  if (!SUPPORTED_MESSAGE_TYPES[messageType].predicate){
    return true;
  }
  return SUPPORTED_MESSAGE_TYPES[messageType].predicate(message);
}

const isMessageTypeSupported = (messageType) => {
  return Object.keys(SUPPORTED_MESSAGE_TYPES).includes(messageType);
};

const extractIdentity = async (message) => {
  const messageType = extractMessageType(message);
  if (!isMessageTypeSupported(messageType)) {
    return null;
  }
  if (!predicatePassed(message, messageType)) {
    console.log('predicate failed');
    return null;
  }
  const identityExtractor =
    SUPPORTED_MESSAGE_TYPES[messageType].identityExtractor;
  const identity = await identityExtractor(message);
  return identity;
};

const createNotification = async (message) => {
  const messageType = extractMessageType(message);
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

exports.commerceNotificationToTwilio = commerceNotificationToTwilio = async (
  event,
  context
) => {
  const message = parseMessage(event);
  const customerIdentity = await extractIdentity(message);
  console.log("customer identity", customerIdentity);
  if (!customerIdentity) {
    return null;
  }
  const notification = await createNotification(message);
  await sendNotification(clientPromise, notification, customerIdentity);
};
