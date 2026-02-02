import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';
import YoutubeRoutes from './routes/YoutubeRoutes';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { JetPaths } from '@src/common/constants/Paths';
import { RouteError } from '@src/common/utils/route-errors';
import EnvVars, { NodeEnvs } from './common/constants/env';
import cors from 'cors';

const app = express();

// **** Middleware **** //
const corsOptions = {
  origin: ['http://localhost'],
  methods: 'OPTIONS,GET',
  credentials: true 
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.DEV) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.PRODUCTION) {
  // eslint-disable-next-line no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}


app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (EnvVars.NodeEnv !== NodeEnvs.TEST.valueOf()) {
    logger.err(err, true);
  }
  let status: HttpStatusCodes = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

app.get(JetPaths.Youtube.Get(), YoutubeRoutes.search);

export default app;
