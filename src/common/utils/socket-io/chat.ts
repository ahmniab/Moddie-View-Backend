import { Socket } from "socket.io";
import { ChatMessage, ChatReaction } from "@src/models/types";
import { SocketEvents } from "./config";
import logger from "jet-logger";
import { nanoidCustom } from "./helpers";

export const mapChatCommands = ( socket: Socket, roomId: string ) => {
    
    socket.on(SocketEvents.CHAT_MESSAGE, async (message: ChatMessage) => {
        socket.nsp.emit(SocketEvents.NEW_CHAT_MESSAGE, { ...message, id: `msg_${nanoidCustom()}` });
        logger.info(`Socket ${socket.id} sent a chat message: ${message.text}, in room ${roomId}`);
    });
    
    socket.on(SocketEvents.CHAT_REACT_ON_MESSAGE, async (reaction: ChatReaction) => {
      if (!reaction.messageId || !reaction.reaction) {
        return;
      }
      socket.nsp.emit(SocketEvents.NEW_CHAT_REACTION, reaction);
    });
}