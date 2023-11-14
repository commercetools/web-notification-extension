/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Message } from '@commercetools/platform-sdk';
import {
  MessageTypeReturn,
  PayloadIntersection,
  SupportedMessageJsonItem,
  SupportedMessageTypes,
  SupportedMessageTypeMap,
} from '../interfaces/message.interface';
import { MapMessageTypeToObjectEndpoint } from './constants';
import { getCustomerReferenceCallback } from './referenceUtilities';

export const SUPPORTED_MESSAGE_JSON: SupportedMessageJsonItem[] = [
  {
    type: 'StagedQuoteCreated',
    subject: 'Your quote request has been accepted and under review',
    body: `<div>
      Your quote request has been accepted. You can view it <a href="/account?id={{id}}#quotes">here</a>
    </div>`,
  },
  {
    type: 'QuoteCreated',
    subject: 'Your quote has been created!',
    body: `<div>
      Your quote has been created. You can view it <a href="/account?id={{id}}#quotes">here</a>
    </div>`,
  },
  {
    type: 'QuoteRequestStateChanged',
    subject: 'Your quote has been rejected :(',
    body: `<div>
      Your quote has been rejected. You can view it <a href="/account?id={{id}}#quotes">here</a>
    </div>`,
    predicate: 'message.resource.quoteRequestState === "Rejected"',
  },
];

export const createSupportedMessageTypes = (
  type: SupportedMessageTypes
): MessageTypeReturn | null => {
  const supportedMessageJSON = SUPPORTED_MESSAGE_JSON.find(
    (message) => message.type === type
  );
  if (!supportedMessageJSON) {
    return null;
  }
  const { object, endpoint } = MapMessageTypeToObjectEndpoint[type];

  const messageBuilder: MessageTypeReturn = {
    identityExtractor: async (message: PayloadIntersection) => {
      if (supportedMessageJSON.useCustomIdentity && supportedMessageJSON.customIdentity) {
        return supportedMessageJSON.customIdentity;
      }
      const customerEmail = await getCustomerReferenceCallback(
        message,
        object,
        endpoint
      );
      return customerEmail;
    },
    getNotificationBody: (message?: Message) => {
      return supportedMessageJSON.body.replace(
        '{{id}}',
        message?.resource?.id || ''
      );
    },
    getNotificationSubject: (message?: Message) => {
      return supportedMessageJSON.subject.replace(
        '{{id}}',
        message?.resource?.id || ''
      );
    },
  };
  if (supportedMessageJSON.predicate) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messageBuilder.predicate = (message: Message) =>
      eval(supportedMessageJSON.predicate!);
  }
  return messageBuilder;
};

export const SUPPORTED_MESSAGE_TYPES: SupportedMessageTypeMap = {
  StagedQuoteCreated: createSupportedMessageTypes('StagedQuoteCreated'),
  QuoteCreated: createSupportedMessageTypes('QuoteCreated'),
  QuoteRequestStateChanged: createSupportedMessageTypes(
    'QuoteRequestStateChanged'
  ),
};
