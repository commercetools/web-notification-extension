import { createApiRoot } from '../client/create.client';
import { MessageConfigurationItem } from '../interfaces/message.interface';
import { logger } from '../utils/logger.utils';

let MessagesConfigurations: MessageConfigurationItem[];

export const initializeMessagesConfiguration = async (): Promise<void> => {
  const {
    CONFIGURATOR_CUSTOM_OBJECT_CONTAINER = 'mc-twilio-notification-container',
    CONFIGURATOR_CUSTOM_OBJECT_KEY = 'supported_message_configuration',
  } = process.env;
  try {
    const response = await createApiRoot()
    .customObjects()
    .withContainerAndKey({
      container: CONFIGURATOR_CUSTOM_OBJECT_CONTAINER,
      key: CONFIGURATOR_CUSTOM_OBJECT_KEY,
    })
    .get()
    .execute();
  MessagesConfigurations = response.body.value;
  } catch (error) {
    logger.error(error);
  }
  
};

export function getMessagesConfiguration(): MessageConfigurationItem[] {
  if (MessagesConfigurations === undefined) {
    logger.error('SUPPORTED_MESSAGE_JSON has not been initialized');
  }
  return MessagesConfigurations;
}
