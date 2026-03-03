import redis from './config';
import { RedisRoom, Users } from '../../models/types';
import { jsonStringify, jsonParse } from '@src/common/utils/hepers';
import { validateUUID } from '@src/common/utils/validators';
import EnvVars from '@src/common/constants/env';

export const getRoom = async (roomId: string): Promise<RedisRoom | null> => {
    const room = await redis?.get(roomId);
    if (room) return jsonParse<RedisRoom>(room);
    return null;
}

export const setRoom = async (room: RedisRoom): Promise<boolean> => {
    const result = await redis?.set(room.roomId, jsonStringify(room), 'EX', EnvVars.RoomExpirationTime);
    return result === 'OK';
}

export const deleteRoom = async (roomId: string): Promise<boolean> => {
    const result = await redis?.del(roomId);
    return result === 1;
}

export const setRoomUsers = async (roomId: string, users: Users): Promise<boolean> => {
    const room = await getRoom(roomId);
    if (!room) return false;
    room.users = users;
    return setRoom(room);
}

export const getRoomUsers = async (roomId: string): Promise<Users | null> => {
    const room = await getRoom(roomId);
    if (!room) return null;
    return room.users;
}

export const isRoomExists = async (roomId: string): Promise<boolean> => {
    return await redis?.exists(roomId) === 1;
}

export const getAllRoomKeys = async (): Promise<string[]> => {
    const keys = await redis?.keys('????????-????-4???-????-????????????');
    return keys || [];
}