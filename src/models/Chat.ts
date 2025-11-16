import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage {
  id: string;
  role: "user" | "assistant" | "system" | "function";
  content: string;
}

export interface IChat extends Document {
  userId: string;
  messages: IMessage[];
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  id: { type: String, required: true },
  role: { type: String, enum: ["user","assistant","system","function"], required: true },
  content: { type: String, required: true }
}, { _id: false });

const ChatSchema = new Schema<IChat>({
  userId: { type: String, required: true, index: true },
  messages: { type: [MessageSchema], required: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;
