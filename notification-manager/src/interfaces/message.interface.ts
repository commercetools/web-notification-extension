import {
  CustomerReference,
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
  predicate?: (message: any) => (message: any, predicate: string) => boolean;
};

export interface SupportedMessageTypes {
  [key: string]: MessageTypeReturn | null;
}

export interface SupportedIdentityExtractorReturn {
  label: string;
  callback: (customerReference: CustomerReference) => Promise<string | null>;
}

export interface ReferenceExtractorFunctionReturn {
  customerCallback: (object: any) => any | undefined;
  objectCallback: (object: any) => any | undefined;
}
