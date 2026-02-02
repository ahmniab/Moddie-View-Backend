import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { searchYouTubeVideos } from '@src/services/YoutubeService';

import { Req, Res } from './common/express-types';
import { YoutubeVideo } from '@src/models/common/types';

/**
 * Search YouTube videos by query.
 *
 * @route GET /api/youtube/search/:query
 */
async function search(req: Req, res: Res) {
  const query = req.params.query;
  const results: YoutubeVideo[] = (await searchYouTubeVideos(query)).map((video) => ({
    id: video.id?.videoId || '',
    title: video.snippet?.title || '',
    description: video.snippet?.description || '',
    thumbnail: {
        url: video.snippet?.thumbnails?.default?.url || '',
        width: video.snippet?.thumbnails?.default?.width || 0,
        height: video.snippet?.thumbnails?.default?.height || 0,
    },
  }));
  return res.status(HttpStatusCodes.OK).json(results);
}

export default {
  search,
};

