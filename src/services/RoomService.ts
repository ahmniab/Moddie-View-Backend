import { createNewRoomInstance } from "@src/common/utils/room"
import { getRoom, setRoom, setTimeOut } from "@src/lib/redis"
import { Server } from "socket.io";
import {  Room } from "@src/models/types";
import EnvVars from "@src/common/constants/env";
import { mapUsersCommands, mapChatCommands } from "@src/common/utils/socket-io";


export const createNewRoom = (io: Server, roomName: string = "New Room"): Room => {
    const newRoomInstance = createNewRoomInstance(roomName);
    setRoom(newRoomInstance);
    setTimeOut(newRoomInstance.roomId, EnvVars.RoomExpirationTime);
    io.of(newRoomInstance.roomId).use(async (socket, next) => {
        console.log(`Socket ${socket.id} is trying to connect to room ${newRoomInstance.roomId}`);
        const room = await getRoom(newRoomInstance.roomId);
        const clientName = socket.handshake.query?.name as string || socket.id;

        if (!room) {
            return next(new Error('Room not found'));
        }
        room.users[socket.id] = { name: clientName };
        if (room.roomOwner === "") {
            room.roomOwner = socket.id;
        }
        await setRoom(room);
        next();
    });

    io.of(newRoomInstance.roomId).on('connection', async (socket) => {
        socket.on("CMD:getRoomData", async () => {
            console.log(`Socket ${socket.id} requested room data for room ${newRoomInstance.roomId}`);
            const roomData = await getRoom(newRoomInstance.roomId);
            if (roomData) {
                socket.emit("roomData", roomData as Room);
            }
        });
        mapUsersCommands(socket, newRoomInstance.roomId);
        mapChatCommands(socket, newRoomInstance.roomId);
        console.log(`Socket ${socket.id} connected to room ${newRoomInstance.roomId}`);

    });
    return newRoomInstance;
}

