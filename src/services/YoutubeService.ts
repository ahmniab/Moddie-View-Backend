import { youtube, youtube_v3 } from "@googleapis/youtube";
import EnvVars from '../common/constants/env';

const youtubeClient = EnvVars.YoutubeApiKey ? youtube({
        version: 'v3',
        auth: EnvVars.YoutubeApiKey,
    }) : null;

export const searchYouTubeVideos = async (query: string): Promise<youtube_v3.Schema$SearchResult[]> => {
    if (!youtubeClient) return [];

    const response = await youtubeClient.search.list({
        part: ['snippet'],
        q: query,
        type: ['video'],
        maxResults: 10,
    });

    return response.data.items || [];
}