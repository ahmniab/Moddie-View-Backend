import { createNewRoomInstance } from "@src/common/utils/room"
import { getRoom, getRoomUsers, setRoom, setRoomUsers, setTimeOut } from "@src/lib/redis"
import { Server, Socket } from "socket.io";
import { RedisRoom, Room } from "@src/models/types";
import EnvVars from "@src/common/constants/env";


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
        const roomData = await getRoom(newRoomInstance.roomId);
        const room = await getRoom(newRoomInstance.roomId) as RedisRoom;
        socket.on("CMD:getRoomData", async () => {
            console.log(`Socket ${socket.id} requested room data for room ${newRoomInstance.roomId}`);
            const roomData = await getRoom(newRoomInstance.roomId);
            if (roomData) {
                socket.emit("roomData", roomData as Room);
            }
        });
        mapUsersCommands(socket, newRoomInstance.roomId);
        console.log(`Socket ${socket.id} connected to room ${newRoomInstance.roomId}`);

    });
    return newRoomInstance;
}

const mapUsersCommands = ( socket: Socket, roomId: string ) => {
    socket.on("CMD:name", async (newName: string) => {
        const roomUsers = await getRoomUsers(roomId);
        if (!roomUsers) return;
        const userIndex = Object.keys(roomUsers).findIndex(key => key === socket.id);
        if (userIndex === -1) return;
        const userKey = Object.keys(roomUsers)[userIndex];
        roomUsers[userKey].name = newName;
        setRoomUsers(roomId, roomUsers);
        socket.emit("CMD:usersUpdate", roomUsers);
    });

    socket.on("disconnect", async () => {
        const roomUsers = await getRoomUsers(roomId);
        if (!roomUsers) return;
        const updatedUsers = Object.fromEntries(
            Object.entries(roomUsers).filter(([key]) => key !== socket.id)
        );
        setRoomUsers(roomId, updatedUsers);
        socket.emit("CMD:usersUpdate", updatedUsers);
    });
}