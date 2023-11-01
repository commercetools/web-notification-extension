import { Client } from '@twilio/conversations';
import axios from 'axios';
import { logger } from '../utils/logger.utils';

const { username, password, accessTokenServiceUrl } = {
  username: process.env.CT_NOTIFIER_USERNAME || '',
  password: process.env.CT_NOTIFIER_PASSWORD || '',
  accessTokenServiceUrl: process.env.ACCESS_TOKEN_SERVICE_URL || '',
};
async function getToken() {
  if (!accessTokenServiceUrl) {
    throw new Error('no accessTokenServiceUrl');
  }

  try {
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);

    const response = await axios
      .get(
        `${accessTokenServiceUrl}?identity=${encodedUsername}&password=${encodedPassword}`,
        {
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .then((res) => res.data);
    return response;
  } catch (error) {
    logger.error(error);
  }
}

export const initializeTwilio = async () => {
  const token = await getToken();
  logger.info('got access token');

  const client = new Client(token);

  client.on('initialized', () => {
    logger.info('CLIENT INITALIZED');
  });

  client.on('connectionStateChange' as any, (state: string) => {
    logger.info('CLIENT state' + state);
  });

  client.on('tokenAboutToExpire', () => {
    logger.info('IS ABOUT to expire');
    if (username && password) {
      getToken().then((token) => {
        client.updateToken(token);
      });
    }
  });

  client.on('tokenExpired', () => {
    logger.info('expired');
    if (username && password) {
      getToken().then((token) => {
        client.updateToken(token);
      });
    }
  });
  return client;
};
