import mongoose from "mongoose";
import { UIMessage } from "ai";

export type MessageRole = "user" | "assistant" | "system" | "function";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
}

export type ChatMessage = UIMessage;

export interface FlashcardData {
  userId: string;
  chatId: mongoose.Types.ObjectId;
  cards: { question: string; answer: string }[];
}