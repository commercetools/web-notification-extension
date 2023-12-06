import { PERMISSIONS } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Twilio configurator',
  description: 'Configure Twilio',
  entryPointUriPath: 'configurator',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
    },
    production: {
      applicationId: '${env:APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  additionalEnv: {
    customObjectContainer: '${env:CONFIGURATOR_CUSTOM_OBJECT_CONTAINER}',
    customObjectKey: '${env:CONFIGURATOR_CUSTOM_OBJECT_KEY}',
    subscriptionKey: '${env:SUBSCRIPTION_KEY}',
    topic: '${env:NOTIFICATION_MANAGER_TOPIC}',
    projectkey: '${env:NOTIFICATION_MANAGER_PROJECT_KEY}',
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_project'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/gift.svg}',
  mainMenuLink: {
    defaultLabel: 'Twilio configurator',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
};

export default config;
