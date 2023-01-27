const { Client } = require("@twilio/conversations");
const fetch = require("node-fetch");

const { username, password, accessTokenServiceUrl } = {
  username: process.env["CTP_NOTIFIER_USERNAME"] || "",
  password: process.env["CTP_NOTIFIER_PASSWORD"] || "",
  accessTokenServiceUrl: process.env["ACCESS_TOKEN_SERVICE_URL"] || "",
};
async function getToken() {
  if (!accessTokenServiceUrl) {
    throw new Error("no accessTokenServiceUrl");
  }

  try {
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);

    const response = await fetch(
      `${accessTokenServiceUrl}?identity=${encodedUsername}&password=${encodedPassword}`,
      {
        method: "get",
        headers: { "Content-Type": "application/json" },
      }
    ).then((res) => res.text());
    return response;
  } catch (error) {
    console.error(error);
  }
}

const initialize = async () => {
  const token = await getToken();
  console.log("got access token" + token);

  const client = new Client(token);

  client.on("initialized", () => {
    console.log("CLIENT INITALIZED");
  });

  client.on("connectionStateChange", (state) => {
    console.log("CLIENT state" + state);
  });

  client.on("tokenAboutToExpire", () => {
    console.log('IS ABOUT to expire');
    if (username && password) {
      getToken().then((token) => {
        client.updateToken(token);
      });
    }
  });

  client.on("tokenExpired", () => {
    console.log('expired');
    if (username && password) {
      getToken(username, password).then((token) => {
        client.updateToken(token);
      });
    }
  });
  return client;
};

exports.initialize = initialize;
