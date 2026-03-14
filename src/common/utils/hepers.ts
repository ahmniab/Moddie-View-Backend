import { notification } from "@src/models/types";
import { nanoidCustom } from "./socket-io/helpers";
import { randomUUID } from "node:crypto";

export const generateUUID = (): string => {
  return randomUUID();
};

export const jsonStringify = (data: any): string => {
  return JSON.stringify(data);
}

export const jsonParse = <T>(data: string): T => {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    throw new Error('Failed to parse JSON data');
  }
}

export const calculateVideoTime = (currentTime: number, lastTimePlayed: number) => {
    if (lastTimePlayed === 0) return currentTime;
    const now = new Date().getTime();
    const elapsed = (now - lastTimePlayed) / 1000;
    return currentTime + elapsed;
}

export const createNotification = (type: notification['type'], producerName: string): notification => {
  return {
    id: `notif_${nanoidCustom()}`,
    type,
    producerName,
    createdAt: new Date().getTime(),
  }
}

export const createPlayEventNotification = (userName: string): notification => {
  return createNotification('play', userName);
}

export const createPauseEventNotification = (userName: string): notification => {
  return createNotification('pause', userName);
}

export const createSeekEventNotification = (userName: string): notification => {
  return createNotification('seek', userName);
}

export const createContentChangeEventNotification = (userName: string): notification => {
  return createNotification('videoChange', userName);
}

export const createJoinEventNotification = (userName: string): notification => {
  return createNotification('join', userName);
}

export const createLeaveEventNotification = (userName: string): notification => {
  return createNotification('leave', userName);
}

export const createPlaybackRateChangeEventNotification = (userName: string): notification => {
  return createNotification('playbackRate', userName);
}