import { setRoomUsers, getRoomUsers } from "@src/lib/redis";
import { SocketEvents } from "./config";
import { Socket } from "socket.io";

export const addNewUserToRoom = async (roomId: string, socket: Socket, name: string) => {
    const roomUsers = await filterDisconnectedUsers(roomId, Array.from(socket.nsp.sockets.keys())) || {};
    const updatedUsers = {
        ...roomUsers,
        [socket.id]: { name },
    };
    const added = await setRoomUsers(roomId, updatedUsers);
    if (added) {
        socket.nsp.emit(SocketEvents.USERS_UPDATE, updatedUsers);
    }
}

export const removeUserFromRoom = async (roomId: string, socket: Socket) => {
    const roomUsers = await getRoomUsers(roomId);
    if (!roomUsers) return;
    const updatedUsers = Object.fromEntries(
        Object.entries(roomUsers).filter(([key]) => key !== socket.id)
    );
    await setRoomUsers(roomId, updatedUsers);
    socket.nsp.emit(SocketEvents.USERS_UPDATE, updatedUsers);
}

export const getUsersInRoom = async (roomId: string) => {
    return await getRoomUsers(roomId);
}

export const filterDisconnectedUsers = async (roomId: string, activeSocketIds: string[]) => {
    const roomUsers = await getRoomUsers(roomId);
    if (!roomUsers) return;
    const updatedUsers = Object.fromEntries(
        Object.entries(roomUsers).filter(([key]) => activeSocketIds.includes(key))
    );
    await setRoomUsers(roomId, updatedUsers);
    return updatedUsers;
}