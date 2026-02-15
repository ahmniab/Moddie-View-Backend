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
