import { Socket } from "socket.io";
import { getRoom, setRoom } from "@src/lib/redis";
import { SocketEvents } from "./config";
import { RedisRoom, RoomContent } from "@src/models/types";
import logger from 'jet-logger';
import { calculateVideoTime } from "../hepers";
import { createNewMessage } from "./helpers";

export const mapVideoCommands = ( socket: Socket, roomId: string ) => {

    socket.on(SocketEvents.CONTENT_CHANGE, async (content: RoomContent) => {
        logger.info(`Socket ${socket.id} changed the content in room ${roomId} to ${content ? content : "null"}`);    
        const room = await getRoom(roomId);
        if (!room) {
            return;
        }
        room.roomContent = content;
        await setRoom(room);

        socket.nsp.emit(SocketEvents.CONTENT_CHANGE, room.roomContent);
        socket.nsp.emit(SocketEvents.NEW_CHAT_MESSAGE, createNewMessage(`I Just Changed The Content,`, socket.id, room.users[socket.id].name));
    });

    socket.on(SocketEvents.CONTENT_VIDEO_PLAYBACK_RATE_CHANGE, async (playbackRate: number) => {
        const room = await getRoom(roomId);
        if (!room || !room.roomContent) {
            return;
        }
        syncVideoTime(room);
        room.roomContent.playbackRate = playbackRate;
        await setRoom(room);
        socket.nsp.emit(SocketEvents.CONTENT_VIDEO_PLAYBACK_RATE_CHANGE, room.roomContent);
        socket.nsp.emit(SocketEvents.NEW_CHAT_MESSAGE, createNewMessage(`I Just Changed The Playback Rate To ${playbackRate}x`, socket.id, room.users[socket.id].name));
    });

    socket.on(SocketEvents.CONTENT_VIDEO_PLAY, async () => {
        logger.info(`Socket ${socket.id} played the video in room ${roomId}`);
        const room = await getRoom(roomId);
        if (!room || !room.roomContent) {
            return;
        }
        room.roomContent.lastTimePlayed = new Date().getTime();
        room.roomContent.isPlaying = true;
        await setRoom(room);
        socket.nsp.emit(SocketEvents.CONTENT_VIDEO_PLAY, room.roomContent);
        socket.nsp.emit(SocketEvents.NEW_CHAT_MESSAGE, createNewMessage("I Just Played The Video", socket.id, room.users[socket.id].name));
        logger.info(`Socket ${socket.id} played the video in room ${roomId} (done)`);
    });

    socket.on(SocketEvents.CONTENT_VIDEO_PAUSE, async () => {
        const room = await getRoom(roomId);
        if (!room || !room.roomContent) {
            return;
        }
        syncVideoTime(room);
        room.roomContent.isPlaying = false;
        await setRoom(room);
        socket.nsp.emit(SocketEvents.CONTENT_VIDEO_PAUSE, room.roomContent);
        socket.nsp.emit(SocketEvents.NEW_CHAT_MESSAGE, createNewMessage("I Just Paused The Video", socket.id, room.users[socket.id].name));
        logger.info(`Socket ${socket.id} paused the video in room ${roomId} (done)`);
    });

    socket.on(SocketEvents.CONTENT_VIDEO_SEEK, async (time: number) => {
        const room = await getRoom(roomId);
        if (!room || !room.roomContent) {
            return;
        }
        syncVideoTime(room);
        room.roomContent.videoTime = time;
        await setRoom(room);
        socket.nsp.emit(SocketEvents.CONTENT_VIDEO_SEEK, room.roomContent);
        socket.nsp.emit(SocketEvents.NEW_CHAT_MESSAGE, createNewMessage(`I Just Sought The Video To ${Math.floor(time)} Seconds`, socket.id, room.users[socket.id].name));
    });

    socket.on(SocketEvents.CONTENT_VIDEO_SYNC, async () => {
        logger.info(`Socket ${socket.id} requested video sync in room ${roomId}`);
        const room = await getRoom(roomId);
        if (!room || !room.roomContent) {
            return;
        }
        socket.emit(SocketEvents.CONTENT_VIDEO_SYNC, room.roomContent);
    });
}

const syncVideoTime = async (room: RedisRoom) => {
    if (!room || !room.roomContent) {
        return;
    }
    const currentTime = new Date().getTime();
    room.roomContent.videoTime = calculateVideoTime(room.roomContent.videoTime, room.roomContent.lastTimePlayed);
}
