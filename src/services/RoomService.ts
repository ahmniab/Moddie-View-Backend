import { createNewRoomInstance } from "@src/common/utils/room"
import { 
    getRoom, 
    setRoom, 
    isRoomExists,
    getAllRoomKeys,
} from "@src/lib/redis"
import { Server } from "socket.io";
import { Room } from "@src/models/types";
import EnvVars from "@src/common/constants/env";
import { 
    mapUsersCommands, 
    mapChatCommands, 
    mapVideoCommands 
} from "@src/common/utils/socket-io";
import logger from 'jet-logger';


export const initializeRoomService = (io: Server) => {
    io.of(/^\/.*$/).use(async (socket, next) => {
        const roomId = socket.nsp.name.slice(1); // Remove leading slash
        
        if (!await isRoomExists(roomId)) {
            logger.info(`Forbidden connection attempt to: ${socket.nsp.name}`);
            logger.info(`roomexists: ${await isRoomExists(roomId)}`);
            socket.disconnect(); // Disconnect unauthorized namespace
            return next(new Error('Room not found'));
        }
        
        next();
    });
    if (EnvVars.NodeEnv === "development") {
        logger.info("RoomService initialized with Socket.IO namespaces:");
        getAllRoomKeys().then(keys => {
            keys.forEach(key => initializeRoomNamespace(io, key));
        });
    }
}


export const createNewRoom = (io: Server, roomName: string = "New Room"): Room => {
    const newRoomInstance = createNewRoomInstance(roomName);
    setRoom(newRoomInstance);
    initializeRoomNamespace(io, newRoomInstance.roomId);
    return newRoomInstance;
}

const initializeRoomNamespace = (io: Server, roomId: string) => {
    logger.info(`Initializing namespace for room: ${roomId}`);
    io.of(roomId).use(async (socket, next) => {
        logger.info(`Socket ${socket.id} is trying to connect to room ${roomId}`);
        const room = await getRoom(roomId);
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

    io.of(roomId).on('connection', async (socket) => {
        socket.on("CMD:getRoomData", async () => {
            logger.info(`Socket ${socket.id} requested room data for room ${roomId}`);
            const roomData = await getRoom(roomId);
            if (roomData) {
                socket.emit("roomData", roomData as Room);
            }
        });
        mapUsersCommands(socket, roomId);
        mapChatCommands(socket, roomId);
        mapVideoCommands(socket, roomId);
        logger.info(`Socket ${socket.id} connected to room ${roomId}`);

    });
}