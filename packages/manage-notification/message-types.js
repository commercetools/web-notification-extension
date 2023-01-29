const { apiRoot } = require("./api-client");

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
    getNotificationBody: (message) => {
      return `<div>
          Your quote request has been accepted. You can view it <a href="/account?id=${message.stagedQuote.quoteRequest.id}#quotes">here</a>
        </div>`;
    },
    getNotificationSubject: (message) => {
      return `Your quote request has been accepted and under review`;
    },
  },
  QuoteCreated: {
    identityExtractor: async (message) => {
      const customerReference = message.quote.customer;
      const customer = await apiRoot
        .customers()
        .withId({ ID: customerReference.id })
        .get()
        .execute()
        .then((res) => res.body);
      return customer.email;
    },
    getNotificationBody: (message) => {
      return `<div>
          Your quote has been created. You can view it <a href="/account?id=${message.quote.quoteRequest.id}#quotes">here</a>
        </div>`;
    },
    getNotificationSubject: (message) => {
      return `Your quote has been created!`;
    },
  },
  QuoteRequestStateChanged: {
    predicate: (message) => message.quoteRequestState === "Rejected",
    identityExtractor: async (message) => {
      const quoteRequestId = message.resource.id;
      const customer = await apiRoot
        .quoteRequests()
        .withId({ ID: quoteRequestId })
        .get()
        .execute()
        .then((res) =>
          apiRoot
            .customers()
            .withId({ ID: res.body.customer.id })
            .get()
            .execute().then(response => response.body)
        );
      return customer.email;
    },
    getNotificationBody: (message) => {
      const quoteRequestId = message.resource.id;

      return `<div>
          Your quote has been rejected. You can view it <a href="/account?id=${quoteRequestId}#quotes">here</a>
        </div>`;
    },
    getNotificationSubject: (message) => {
      return `Your quote has been rejected :(`;
    },
  },
};

exports.SUPPORTED_MESSAGE_TYPES = SUPPORTED_MESSAGE_TYPES;
