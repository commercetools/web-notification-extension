// https://www.twilio.com/docs/conversations/create-tokens
"use strict";

const AccessToken = require("twilio").jwt.AccessToken;
const { ClientBuilder } = require("@commercetools/sdk-client-v2");
const {
  createApiBuilderFromCtpClient,
} = require("@commercetools/platform-sdk");
const fetch = require("node-fetch");

const { clientId, clientSecret, host, oauthHost, projectKey } = {
  clientId: process.env["CTP_CLIENT_ID"] || "",
  clientSecret: process.env["CTP_CLIENT_SECRET"] || "",
  projectKey: process.env["CTP_PROJECT_KEY"] || "",
  oauthHost: process.env["CTP_AUTH_URL"] || "",
  host: process.env["CTP_API_URL"] || "",
};

function createCTPCLient() {
  const authMiddlewareOptions = {
    host: oauthHost,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
    },
    fetch,
  };

  const httpMiddlewareOptions = {
    host,
    fetch,
  };

  const client = new ClientBuilder()
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
}

const apiRoot = createCTPCLient();

const authenticate = async (username, password) => {
  return apiRoot
    .login()
    .post({
      body: {
        email: username,
        password: password,
      },
    })
    .execute()
    .then((response) => {
      return !!response.body.customer;
    })
    .catch((e) => {
      return false;
    });
};
exports.twilioAccessTokenGenerator = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const identity = req.query.identity;
  const password = req.query.password;
  const authenticated = await authenticate(identity, password);

  if (!authenticated) {
    res.statusCode = 401;
    res.send("unauthorized");
    return;
  }

  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioApiKey = process.env.TWILIO_API_KEY;
  const twilioApiSecret = process.env.TWILIO_API_SECRET;

  // Used specifically for creating Chat tokens
  const serviceSid = process.env.TWILIO_CHAT_SERVICE_SID;
  const pushNotificationSid = process.env.PUSH_CREDENTIAL_SID;

  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity: identity, ttl: 60 * 60 * 3 }
  );

  const chatGrant = new AccessToken.ChatGrant({
    serviceSid: serviceSid,
  });
  if (pushNotificationSid) {
    // Optional: without it, no push notifications will be sent
    chatGrant.pushCredentialSid = pushNotificationSid;
  }
  token.addGrant(chatGrant);
  const tokenJWT = token.toJwt();

  res.statusCode = 200;

  res.send(tokenJWT);
};
