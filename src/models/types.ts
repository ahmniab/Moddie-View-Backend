export type VimeoVideo = {
    platform: "vimeo";
    id: number;
    title: string;
    description: string;
    thumbnails: {
        thumbnail_url?: string;
        thumbnail_width?: number;
        thumbnail_height?: number;
  };
};

export type YoutubeVideo = {
  id: string;
  title: string;
  description: string;
  platform: 'youtube';
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
};

export type NormalVideo = {
  url: string;
  platform: 'directmedia';
};

export type PlayableVideo = {
  isPlaying: boolean;
  lastTimePlayed : number;
  playbackRate: number;
  videoTime: number;
};
export type Video = ( NormalVideo | YoutubeVideo | VimeoVideo ) & PlayableVideo; 

export type VideoPlaylist = {
  videos: Video[];
  currentIndex: number;
  isPlaying: boolean;
  videoStartTime: number;
};

export type RoomContent = Video | null;

export interface UserData {
  name: string;
}
export type Users = Record<string, UserData>;

export type RoomData = {
  roomName: string;
  roomOwner: string;
  users: Users;
  roomContent: RoomContent;
  bannedUsers?: string[];
};

export type Room = { roomId: string; } & RoomData;

export type RedisRoom = {
  ownerWebToken: string;
} & Room;

//////////////////////////////////////////////

export interface ChatMessage {
  id: string | undefined;
  text: string;
  senderId: string;
  senderName?: string;
  replyTo?: {
    id: string;
    text: string;
    senderName?: string;
    isOwn?: boolean;
  };
  sentAt: number;
}

export interface ChatReaction {
  messageId: string;
  reaction: string;
  senderId: string;
  reactedAt: number;
}

export type notification = {
  id: string;
  type: "play" | "pause" | "seek" | "videoChange" | "join" | "leave" | "playbackRate";
  producerName: string;
  createdAt: number;
};