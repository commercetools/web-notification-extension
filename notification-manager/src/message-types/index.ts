/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  CustomerReference,
  Message,
  Quote,
  QuoteRequestStateChangedMessage,
  StagedQuote,
} from '@commercetools/platform-sdk';
import { createApiRoot } from '../client/create.client';
import {
  MessageTypeReturn,
  PayloadIntersection,
  ReferenceExtractorFunctionReturn,
  SupportedIdentityExtractorReturn,
  SupportedMessageTypes,
} from '../interfaces/message.interface';

export const SUPPORTED_IDENTITY_EXTRACTOR_FUNCTIONS: Record<
  string,
  SupportedIdentityExtractorReturn
> = {
  fromCustomerReference: {
    label: 'From Customer Reference',
    callback: async (customerReference: CustomerReference) => {
      const customer = await createApiRoot()
        .customers()
        .withId({ ID: customerReference.id })
        .get()
        .execute()
        .then((res) => res.body);
      return customer.email;
    },
  },
  fromQuoteRequest: {
    label: 'From Quote Request',
    callback: async (resource: Message['resource']) => {
      const quoteRequestId = resource.id;
      if (!quoteRequestId) {
        return null;
      }
      const customer = await createApiRoot()
        .quoteRequests()
        .withId({ ID: quoteRequestId })
        .get()
        .execute()
        .then((res) =>
          createApiRoot()
            .customers()
            .withId({ ID: res.body.customer.id })
            .get()
            .execute()
            .then((response) => response.body)
        );
      return customer.email;
    },
  },
};

export const REFERENCE_EXTRACTOR_FUNCTIONS: Record<
  string,
  ReferenceExtractorFunctionReturn
> = {
  stagedQuote: {
    customerCallback: (message: { stagedQuote?: StagedQuote }) =>
      message.stagedQuote?.customer,
    objectCallback: (message: { stagedQuote?: StagedQuote }) =>
      message.stagedQuote?.quoteRequest,
  },
  quote: {
    customerCallback: (message: { quote?: Quote }) => message.quote?.customer,
    objectCallback: (message: { quote?: Quote }) => message.quote?.quoteRequest,
  },
  resource: {
    customerCallback: (message: {
      resource?: QuoteRequestStateChangedMessage['resource'];
    }) => message.resource,
    objectCallback: (message: {
      resource?: QuoteRequestStateChangedMessage['resource'];
    }) => message.resource,
  },
};

export const SUPPORTED_MESSAGE_JSON = [
  {
    type: 'StagedQuoteCreated',
    object: 'stagedQuote',
    referenceLocator:
      SUPPORTED_IDENTITY_EXTRACTOR_FUNCTIONS.fromCustomerReference.callback,
    subject: 'Your quote request has been accepted and under review',
    body: `<div>
      Your quote request has been accepted. You can view it <a href="/account?id={{id}}#quotes">here</a>
    </div>`,
  },
  {
    type: 'QuoteCreated',
    object: 'quote',
    referenceLocator:
      SUPPORTED_IDENTITY_EXTRACTOR_FUNCTIONS.fromCustomerReference.callback,
    subject: 'Your quote has been created!',
    body: `<div>
      Your quote has been created. You can view it <a href="/account?id={{id}}#quotes">here</a>
    </div>`,
  },
  {
    type: 'QuoteRequestStateChanged',
    object: 'resource',
    referenceLocator:
      SUPPORTED_IDENTITY_EXTRACTOR_FUNCTIONS.fromQuoteRequest.callback,
    subject: 'Your quote has been rejected :(',
    body: `<div>
      Your quote has been rejected. You can view it <a href="/account?id={{id}}#quotes">here</a>
    </div>`,
    predicate: 'message.resource.quoteRequestState === "Rejected"',
  },
];

export const createSupportedMessageTypes = (
  type: string
): MessageTypeReturn | null => {
  const messageJson = SUPPORTED_MESSAGE_JSON.find(
    (message) => message.type === type
  );
  if (!messageJson) {
    return null;
  }
  const messageTypeReferenceLocator =
    REFERENCE_EXTRACTOR_FUNCTIONS[messageJson.object];
  const messageBuilder: MessageTypeReturn = {
    identityExtractor: async (message: PayloadIntersection) => {
      const customerReference =
        messageTypeReferenceLocator.customerCallback(message);
      if (!customerReference) {
        return null;
      }
      return messageJson.referenceLocator(customerReference);
    },
    getNotificationBody: (message?: PayloadIntersection) => {
      const objectReference =
        messageTypeReferenceLocator.objectCallback(message);
      if (objectReference?.id) {
        return messageJson.body.replace('{{id}}', objectReference.id);
      }
      return messageJson.body;
    },
    getNotificationSubject: (message?: PayloadIntersection) => {
      const objectReference =
        messageTypeReferenceLocator.objectCallback(message);
      if (objectReference?.id) {
        return messageJson.subject.replace('{{id}}', objectReference.id);
      }
      return messageJson.subject;
    },
  };
  if (messageJson.predicate) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messageBuilder.predicate = (message: Message) =>
      eval(messageJson.predicate);
  }
  return messageBuilder;
};

export const SUPPORTED_MESSAGE_TYPES: SupportedMessageTypes = {
  StagedQuoteCreated: createSupportedMessageTypes('StagedQuoteCreated'),
  QuoteCreated: createSupportedMessageTypes('QuoteCreated'),
  QuoteRequestStateChanged: createSupportedMessageTypes(
    'QuoteRequestStateChanged'
  ),
};
