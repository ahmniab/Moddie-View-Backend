import { Socket } from "socket.io";
import { getRoomUsers, setRoomUsers } from "@src/lib/redis";
import { SocketEvents } from "./config";
import logger from 'jet-logger';

export const mapUsersCommands = ( socket: Socket, roomId: string ) => {
    socket.on(SocketEvents.SET_USER_NAME, async (newName: string) => {
        const roomUsers = await getRoomUsers(roomId);
        if (!roomUsers) return;
        const userIndex = Object.keys(roomUsers).findIndex(key => key === socket.id);
        if (userIndex === -1) return;
        const userKey = Object.keys(roomUsers)[userIndex];
        roomUsers[userKey].name = newName;
        setRoomUsers(roomId, roomUsers);
        socket.emit(SocketEvents.USERS_UPDATE, roomUsers);
    });

    socket.on(SocketEvents.DISCONNECT, async () => {
        const roomUsers = await getRoomUsers(roomId);
        if (!roomUsers) return;
        const updatedUsers = Object.fromEntries(
            Object.entries(roomUsers).filter(([key]) => key !== socket.id)
        );
        setRoomUsers(roomId, updatedUsers);
        socket.emit(SocketEvents.USERS_UPDATE, updatedUsers);
    });
}