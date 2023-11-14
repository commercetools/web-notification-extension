import { Message } from '@commercetools/platform-sdk';
import { createApiRoot } from '../client/create.client';
import { SupportedEndpoints } from '../interfaces/message.interface';
import { logger } from '../utils/logger.utils';

const getResource = async (
  message: Message,
  resourceType: string,
  endpoint: SupportedEndpoints
) => {
  if (message.resource.typeId === resourceType) {
    const apiRoot = createApiRoot();
    let topApiRoot;

    if (endpoint &&
      apiRoot[endpoint] &&
      typeof apiRoot[endpoint] === 'function') {
      topApiRoot = apiRoot[endpoint]();
      const resource = await topApiRoot
        .withId({ ID: message.resource.id })
        .get()
        .execute();
      return resource.body;
    }
    logger.error(
      'Method not found: resourceType:' +
      resourceType +
      ' & message:' +
      JSON.stringify(message)
    );
  }
};
export const getCustomerReferenceCallback = async (
  message: Message,
  resourceType: string,
  endpoint: SupportedEndpoints
) => {
  const resource = await getResource(message, resourceType, endpoint);
  if (resource) {
    const customer = await createApiRoot()
      .customers()
      .withId({ ID: resource.customer?.id || '' })
      .get()
      .execute()
      .then((response) => response.body);
    return customer.email;
  }
  logger.error(
    'Method not found: resourceType:' +
    resourceType +
    ' & message:' +
    JSON.stringify(message)
  );
  return null;
};
