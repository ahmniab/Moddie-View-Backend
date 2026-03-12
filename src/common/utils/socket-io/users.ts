import { Socket } from "socket.io";
import { getRoom, setRoom, setRoomUsers } from "@src/lib/redis";
import { SocketEvents } from "./config";
import logger from 'jet-logger';
import { addNewUserToRoom, filterDisconnectedUsers, removeUserFromRoom, sendRoomDataToClient } from "./helpers";

export const mapUsersCommands = async ( socket: Socket, roomId: string ) => {
    sendRoomDataToClient(socket, roomId);
    setTimeout(async () => {
        const room = await getRoom(roomId);
        if (room) {
            socket.nsp.emit(SocketEvents.SET_ROOM_NAME, room.roomName);
        }
    }, 1000);
    socket.on(SocketEvents.SET_USER_NAME, async (newName: string) => {
        logger.info(`Socket ${socket.id} is changing name to ${newName} in room ${roomId}`);
        const roomUsers = await filterDisconnectedUsers(roomId, Array.from(socket.nsp.sockets.keys()));
        if (!roomUsers) return;

        const userIndex = Object.keys(roomUsers).findIndex(key => key === socket.id);
        if (userIndex === -1) {
            addNewUserToRoom(roomId, socket, newName);
            return;
        }
        
        roomUsers[socket.id].name = newName;
        setRoomUsers(roomId, roomUsers);
        socket.nsp.emit(SocketEvents.USERS_UPDATE, roomUsers);
    });

    socket.on(SocketEvents.DISCONNECT, async () => {
        filterDisconnectedUsers(roomId, Array.from(socket.nsp.sockets.keys()))
        removeUserFromRoom(roomId, socket);
    });

    socket.on(SocketEvents.GET_ROOM_DATA, async () => {
        logger.info(`Socket ${socket.id} requested room data for room ${roomId}`);
        await sendRoomDataToClient(socket, roomId);
    });

    socket.on(SocketEvents.SET_ROOM_NAME, async (newName: string) => {
        logger.info(`Socket ${socket.id} is changing room name to ${newName} in room ${roomId}`);
        const room = await getRoom(roomId);
        if (room) {
            room.roomName = newName;
            await setRoom(room);
            socket.nsp.emit(SocketEvents.SET_ROOM_NAME, newName);
        }
    });
}

