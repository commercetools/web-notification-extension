const { apiRoot } = require("./api-client");
const { sendNotification } = require("./notification");
const { initialize } = require("./twilio-client");

const clientPromise = (() => {
  return initialize().then(c => c);
})();


const SUPPORTED_MESSAGE_TYPES = {
  StagedQuoteCreated: {
    identityExtractor: async (message) => {
      const customerReference = message.stagedQuote.customer;
      const customer = await apiRoot
        .customers()
        .withId({ ID: customerReference.id })
        .get()
        .execute()
        .then((res) => res.body);
      return customer.email;
    },
    getNotificationText: (message) => {
      return `<div>
        Your quote has been accepted. You can view it <a href="/account?id=${message.stagedQuote.quoteRequest.id}#quotes">here</a>
      </div>`;
    },
  },
};

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

const isMessageTypeSupported = (messageType) => {
  return Object.keys(SUPPORTED_MESSAGE_TYPES).includes(messageType);
};

const extractIdentity = async (message) => {
  const messageType = extractMessageType(message);
  if (!isMessageTypeSupported(messageType)) {
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
  const getNotificationText =
    SUPPORTED_MESSAGE_TYPES[messageType].getNotificationText;
  return getNotificationText(message);
};

exports.commerceNotificationToTwilio = commerceNotificationToTwilio = async (event, context) => {
  const message = parseMessage(event);
  const customerIdentity = await extractIdentity(message);
  console.log('customer identity', customerIdentity);
  if (!customerIdentity) {
    return null;
  }
  const notification = await createNotification(message);
  await sendNotification(clientPromise, notification, customerIdentity);
};