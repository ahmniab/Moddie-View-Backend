import { Socket } from "socket.io";
import { ChatMessage, ChatReaction } from "@src/models/types";
import nanoid from 'nanoid';

export const mapChatCommands = ( socket: Socket, roomId: string ) => {
    const nanoidCustom = nanoid.customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 15);  
    
    socket.on("CHAT:chatMessage", async (message: ChatMessage) => {
        socket.nsp.emit("CHAT:newChatMessage", { ...message, id: `msg_${nanoidCustom()}` });
        console.log(`Socket ${socket.id} sent a chat message: ${message.text}, in room ${roomId}`);
    });
    
    socket.on("CHAT:reactOnMessage", async (reaction: ChatReaction) => {
      if (!reaction.messageId || !reaction.reaction) {
        return;
      }
      socket.nsp.emit("CHAT:newChatReaction", reaction);
    });
}