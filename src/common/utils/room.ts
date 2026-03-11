import { RedisRoom, Room } from "../../models/types";
import { generateUUID } from "@src/common/utils/hepers";
import { createRoomJwt } from "@src/lib/jwt";

export const createNewRoomInstance = (roomName: string): RedisRoom => {
    const roomId = generateUUID();
    const roomToken = createRoomJwt(roomId);
    return {
        ownerWebToken: roomToken,
        roomId: roomId,
        roomName: roomName,
        roomOwner: "",
        users: {},
        roomContent: {
            url: "https://upload.wikimedia.org/wikipedia/commons/transcoded/a/a7/How_to_make_video.webm/How_to_make_video.webm.1080p.vp9.webm",
            isPlaying: false,
            videoTime: 0,
            playbackRate: 1,
            lastTimePlayed: 0,
            platform: "directmedia",
        },
    };
}