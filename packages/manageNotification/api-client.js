const { ClientBuilder } = require('@commercetools/sdk-client-v2');
const { createApiBuilderFromCtpClient } = require("@commercetools/platform-sdk");
const fetch = require('node-fetch');

const { clientId, clientSecret, host, oauthHost, projectKey } =
{
  clientId: process.env["CTP_CLIENT_ID"] || "",
  clientSecret: process.env["CTP_CLIENT_SECRET"] || "",
  projectKey: process.env["CTP_PROJECT_KEY"] || "",
  oauthHost: process.env["CTP_AUTH_URL"] || "",
  host: process.env["CTP_API_URL"] || ""
}

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

  return createApiBuilderFromCtpClient(client)
    .withProjectKey({ projectKey });
}

exports.apiRoot = createCTPCLient();