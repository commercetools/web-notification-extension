import {
  Message,
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

export type MessageTypeReturn = {
  identityExtractor: IdentityExtractor;
  getNotificationBody: (message?: PayloadIntersection) => string | null;
  getNotificationSubject: (message?: PayloadIntersection) => string;
  predicate?: (message: Message) => (message: Message, predicate: string) => boolean;
};

export type SupportedMessageTypeMap = {
  [key : string]: MessageTypeReturn | null;
};

export type SupportedEndpoints = 'quotes' | 'quoteRequests' | 'stagedQuotes';
export type SupportedMessageTypes = 'StagedQuoteCreated' | 'QuoteCreated' | 'QuoteRequestStateChanged';

export interface MessageConfigurationItem {
  type: string;
  subject: string;
  useCustomIdentity?: boolean;
  customIdentity?: string;
  body: string;
  predicate?: string;
}

