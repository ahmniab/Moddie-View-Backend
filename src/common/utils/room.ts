import { RedisRoom, Room } from "../../models/types";
import { generateUUID } from "@src/common/utils/hepers";
import { createRoomJwt } from "@src/lib/jwt";

export const createNewRoomInstance = (roomName: string = "New Room"): RedisRoom => {
    const roomId = generateUUID();
    const roomToken = createRoomJwt(roomId);
    return {
        ownerWebToken: roomToken,
        roomId: roomId,
        roomName: roomName,
        roomOwner: "",
        users: [],
        roomContent: {
            videos: [
                { url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Charge_-_Blender_Open_Movie-full_movie.webm" },
                { url: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Spring_-_Blender_Open_Movie.webm" },
            ],
            currentIndex: 0,
            isPlaying: false,
            videoStartTime: 0,
        },
    };
}