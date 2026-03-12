import { setRoomUsers, getRoomUsers, getRoom } from "@src/lib/redis";
import { SocketEvents } from "./config";
import { Socket } from "socket.io";
import { Room } from "@src/models/types";

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

export const sendRoomDataToClient = async (socket: Socket, roomId: string) => {
        filterDisconnectedUsers(roomId, Array.from(socket.nsp.sockets.keys()));
    const roomData = await getRoom(roomId);
    if (roomData) {
        socket.emit(SocketEvents.ROOM_DATA, roomData as Room);
    }
}