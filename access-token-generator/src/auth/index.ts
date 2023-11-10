import { createApiRoot } from '../client/create.client';
import { logger } from '../utils/logger.utils';

export const authenticate = async (username: string, password: string) => {
  return createApiRoot()
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
      logger.error(e);
      return false;
    });
};
