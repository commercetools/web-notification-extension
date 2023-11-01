import {
  QuoteCreatedMessagePayload,
  QuoteRequestStateChangedMessage,
  StagedQuoteCreatedMessagePayload,
} from '@commercetools/platform-sdk';

export type PayloadIntersection = StagedQuoteCreatedMessagePayload &
  QuoteCreatedMessagePayload &
  QuoteRequestStateChangedMessage;

export type IdentityExtractor = (
  message: PayloadIntersection
) => Promise<string | null>;

export interface SupportedMessageTypes {
  [key: string]: {
    identityExtractor: IdentityExtractor;
    getNotificationBody: (message: PayloadIntersection) => string | null;
    getNotificationSubject: (message?: PayloadIntersection) => string;
    predicate?: (message: PayloadIntersection) => boolean;
  };
}
