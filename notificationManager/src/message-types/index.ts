import {
  QuoteCreatedMessagePayload,
  QuoteRequestStateChangedMessage,
  StagedQuoteCreatedMessagePayload,
} from '@commercetools/platform-sdk';
import { createApiRoot } from '../client/create.client';
import { SupportedMessageTypes } from '../interfaces/message.interface';

export const SUPPORTED_MESSAGE_TYPES: SupportedMessageTypes = {
  StagedQuoteCreated: {
    identityExtractor: async (message: StagedQuoteCreatedMessagePayload) => {
      const customerReference = message.stagedQuote.customer;
      if (!customerReference) {
        return null;
      }
      const customer = await createApiRoot()
        .customers()
        .withId({ ID: customerReference.id })
        .get()
        .execute()
        .then((res) => res.body);
      return customer.email;
    },
    getNotificationBody: (message: StagedQuoteCreatedMessagePayload) => {
      if (!message?.stagedQuote?.quoteRequest) {
        return null;
      }
      return `<div>
          Your quote request has been accepted. You can view it <a href="/account?id=${message.stagedQuote.quoteRequest.id}#quotes">here</a>
        </div>`;
    },
    getNotificationSubject: () => {
      return `Your quote request has been accepted and under review`;
    },
  },
  QuoteCreated: {
    identityExtractor: async (message: QuoteCreatedMessagePayload) => {
      const customerReference = message.quote.customer;
      if (!customerReference) {
        return null;
      }
      const customer = await createApiRoot()
        .customers()
        .withId({ ID: customerReference.id })
        .get()
        .execute()
        .then((res) => res.body);
      return customer.email;
    },
    getNotificationBody: (message: QuoteCreatedMessagePayload) => {
      return `<div>
          Your quote has been created. You can view it <a href="/account?id=${message.quote.quoteRequest.id}#quotes">here</a>
        </div>`;
    },
    getNotificationSubject: () => {
      return `Your quote has been created!`;
    },
  },
  QuoteRequestStateChanged: {
    predicate: (message: QuoteRequestStateChangedMessage) =>
      message.quoteRequestState === 'Rejected',
    identityExtractor: async (message: QuoteRequestStateChangedMessage) => {
      const quoteRequestId = message.resource.id;
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
    getNotificationBody: (message: QuoteRequestStateChangedMessage) => {
      const quoteRequestId = message.resource.id;

      return `<div>
          Your quote has been rejected. You can view it <a href="/account?id=${quoteRequestId}#quotes">here</a>
        </div>`;
    },
    getNotificationSubject: () => {
      return `Your quote has been rejected :(`;
    },
  },
};
