export type StreamItem = {
  id: string;
  title: string;
  time?: string;
  url: string;
  group?: string;
};

export const streams: StreamItem[] = [];

export const groups: string[] = [];
