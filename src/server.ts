import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';
import YoutubeRoutes from './routes/YoutubeRoutes';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { JetPaths } from '@src/common/constants/Paths';
import { RouteError } from '@src/common/utils/route-errors';
import EnvVars, { NodeEnvs } from './common/constants/env';
import cors from 'cors';
import { createNewRoom, initializeRoomService } from './services/RoomService';

const app = express();

const server = http.createServer(app);
const corsOptions = {
  origin: ['http://localhost:5173'],
  methods: 'OPTIONS,GET,POST',
  credentials: true 
};
const io = new Server(server, {
  cors: corsOptions
});
initializeRoomService(io);

// **** Middleware **** //
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

app.post(JetPaths.Room.Post, async (req, res) => {
    let name : string | undefined;
    try {
        name = req.body.name;
    } catch (error) {
        name = undefined;
    }
    return res.status(HttpStatusCodes.CREATED).json(createNewRoom(io, name || "New Room"));
});



export default server;
