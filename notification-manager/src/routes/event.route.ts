import { Router } from 'express';
import { logger } from '../utils/logger.utils';
import { extractIdentity, parseMessage } from '../message';
import {
  createNotification,
  initializeClient,
  sendNotification,
} from '../notification';

const serviceRouter = Router();

serviceRouter.post('/', async (req, res) => {
  logger.info('Event message received');
  logger.info(JSON.stringify(req.body));

  const message = parseMessage(req.body);
  const customerIdentity = await extractIdentity(message);
  logger.info(customerIdentity);
  if (!customerIdentity) {
    return null;
  }
  const notification = await createNotification(message);
  logger.info('notification created' + JSON.stringify(notification));
  await sendNotification(initializeClient, notification, customerIdentity);
  res.status(200);
  res.send();
});

export default serviceRouter;
