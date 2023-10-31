import { createApiRoot } from '../client/create.client';

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
      return false;
    });
};
