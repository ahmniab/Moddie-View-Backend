import { createNewRoomInstance } from "@src/common/utils/room"
import { 
    getRoom, 
    setRoom, 
    isRoomExists,
    getAllRoomKeys,
} from "@src/lib/redis";
import { SocketEvents } from "@src/common/utils/socket-io/config";
import { Server } from "socket.io";
import { Room } from "@src/models/types";
import EnvVars from "@src/common/constants/env";
import { 
    mapUsersCommands, 
    mapChatCommands, 
    mapVideoCommands 
} from "@src/common/utils/socket-io";
import logger from 'jet-logger';
import { addNewUserToRoom } from "@src/common/utils/socket-io/helpers";


export const initializeRoomService = (io: Server) => {
    io.of(/^\/.*$/).use((socket, next) => {
        void (async () => {
            const roomId = socket.nsp.name.slice(1); // Remove leading slash
            
            if (!(await isRoomExists(roomId))) {
                logger.info(`Forbidden connection attempt to: ${socket.nsp.name}`);
                logger.info(`roomexists: ${await isRoomExists(roomId)}`);
                socket.disconnect(); // Disconnect unauthorized namespace
                return next(new Error('Room not found'));
            }

            const name = socket.handshake.auth.name as string;

            if (!name || typeof name !== 'string') {
                return next(new Error("Invalid or missing name"));
            }
            (socket.data as { name?: string }).name = name;
            
            next();
        })();
    });
    if (EnvVars.NodeEnv === "development") {
        void (async () => {
            logger.info("RoomService initialized with Socket.IO namespaces:");
            const keys = await getAllRoomKeys();
            keys.forEach(key => initializeRoomNamespace(io, key));
        })();
    }
}


export const createNewRoom = (io: Server, roomName: string = "Moddie Room"): Room => {
    const newRoomInstance = createNewRoomInstance(roomName);
    void setRoom(newRoomInstance);
    initializeRoomNamespace(io, newRoomInstance.roomId);
    return newRoomInstance;
}

const initializeRoomNamespace = (io: Server, roomId: string) => {
    logger.info(`Initializing namespace for room: ${roomId}`);
    io.of(roomId).use((socket, next) => {
        void (async () => {
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
        })();
    });

    io.of(roomId).on(SocketEvents.CONNECTION, async (socket) => {     
           
        await addNewUserToRoom(roomId, socket, String((socket.data as { name?: string })?.name || "Moddie Anonymous"));
        mapUsersCommands(socket, roomId);
        mapChatCommands(socket, roomId);
        mapVideoCommands(socket, roomId);
        logger.info(`Socket ${socket.id} connected to room ${roomId}`);
    });
}
