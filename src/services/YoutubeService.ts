import { youtube, youtube_v3 } from "@googleapis/youtube";

const youtubeClient = process.env.YOUTUBE_API_KEY ? youtube({
        version: 'v3',
        auth: process.env.YOUTUBE_API_KEY,
    }) : null;

export const searchYouTubeVideos = async (query: string): Promise<youtube_v3.Schema$SearchResult[]> => {
    if (!process.env.YOUTUBE_API_KEY) return [];
    if (!youtubeClient) return [];

    const response = await youtubeClient.search.list({
        part: ['snippet'],
        q: query,
        type: ['video'],
        maxResults: 10,
    });

    return response.data.items || [];
}