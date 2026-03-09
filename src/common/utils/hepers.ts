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