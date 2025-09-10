export interface User {
  PhoneNumber: string;
  ContactName: string;
  // LastSeen?: string;
}

export interface Message {
  MessageID: string;
  SenderPhoneNumber: string;
  ReceiverPhoneNumber: string;
  ContactName: string;
  MessageBody: string;
  Timestamp: string;
  Direction: string;
  IsIncoming: boolean;
  Emotion: "happy" | "sad" | "angry" | "neutral" | "positive" | string;
}

export interface Chat {
  UserPhoneNumber: string;
  ContactName: string;
  Conversation: Message[];
  LastMessage: Message | null;
  Participants: User[];
  [key: string]: any;
}

export interface EmotionStats {
  happy: number;
  sad: number;
  angry: number;
  neutral: number;
  positive: number;
  [key: string]: number;
}

export type AnalyticsResponse = {
  EmotionStatistics: EmotionStats;
  TotalAnalyzed: number;
};
