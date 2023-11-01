import { Router } from 'express';
import { authenticate } from '../auth';
import { generateToken } from '../twilio/generateToken';

const serviceRouter = Router();

serviceRouter.get('/', async (req, res) => {
  const identity = req.query.identity as string;
  const password = req.query.password as string;
  const authenticated = await authenticate(identity, password);

  if (!authenticated) {
    res.statusCode = 401;
    res.send('unauthorized');
    return;
  }

  const tokenJWT = generateToken(identity);
  res.statusCode = 200;
  res.send(tokenJWT);
});

export default serviceRouter;
