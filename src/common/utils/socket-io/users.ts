import { Socket } from "socket.io";
import { getRoomUsers, setRoomUsers } from "@src/lib/redis";

export const mapUsersCommands = ( socket: Socket, roomId: string ) => {
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