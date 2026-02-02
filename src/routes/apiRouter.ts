import { Router } from 'express';

import { JetPaths } from '@src/common/constants/Paths';

import YoutubeRoutes from './YoutubeRoutes';
/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// ----------------------- Add YouTubeRouter --------------------------------- //
apiRouter.get(JetPaths.Youtube.Get(), YoutubeRoutes.search);
 
/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
