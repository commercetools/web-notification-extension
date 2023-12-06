import { SupportedEndpoints, SupportedMessageTypes } from "../interfaces/message.interface";


export const MapMessageTypeToObjectEndpoint: Record<
  SupportedMessageTypes,
  { object: string; endpoint: SupportedEndpoints }
> = {
  StagedQuoteCreated: {
    object: 'stagedQuote',
    endpoint: 'stagedQuotes',
  },
  QuoteCreated: {
    object: 'quote',
    endpoint: 'quotes',
  },
  QuoteRequestStateChanged: {
    object: 'quoteRequest',
    endpoint: 'quoteRequests',
  },
};

export const MapResourceTypeToSupportedMessageTypes: Record<
  string,
  SupportedMessageTypes[]
> = {
  'staged-quote': ['StagedQuoteCreated'],
  quote: ['QuoteCreated'],
  'quote-request': ['QuoteRequestStateChanged'],
};
