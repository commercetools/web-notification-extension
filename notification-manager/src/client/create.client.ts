import { createClient } from './build.client';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import { readConfiguration } from '../utils/config.utils';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { logger } from '../utils/logger.utils';

/**
 * Create client with apiRoot
 * apiRoot can now be used to build requests to de Composable Commerce API
 */
export const createApiRoot = ((root?: ByProjectKeyRequestBuilder) => () => {
  if (root) {
    return root;
  }
  logger.info(JSON.stringify(readConfiguration()));

  root = createApiBuilderFromCtpClient(createClient()).withProjectKey({
    projectKey: readConfiguration().projectKey,
  });

  return root;
})();
