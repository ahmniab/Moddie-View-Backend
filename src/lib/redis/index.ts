import redis from './config';
import { Room } from '../../models/types';
import { jsonStringify, jsonParse } from '@src/common/utils/hepers';

export const getRoom = async (roomId: string): Promise<Room | null> => {
    const room = await redis?.get(roomId);
    if (room) return jsonParse<Room>(room);
    return null;
}

export const setRoom = async (room: Room): Promise<boolean> => {
    const result = await redis?.set(room.roomId, jsonStringify(room));
    return result === 'OK';
}

