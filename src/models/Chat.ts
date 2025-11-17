import mongoose, { Schema, Document, Model } from "mongoose";
import { UIMessage } from "ai";

export interface IChat extends Document {
  userId: string;
  title: string;
  messages: UIMessage[];
  createdAt: Date;
}

const MessageSchema = new Schema({
  id: { type: String, required: true },
  role: { type: String, required: true },
  parts: { type: Schema.Types.Mixed, required: false },
  display: { type: Schema.Types.Mixed, required: false },
  experimental_attachments: { type: Schema.Types.Mixed, required: false },
  content: { type: String, required: false }
}, { _id: false, strict: false });

const ChatSchema = new Schema<IChat>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true, default: "New Chat" },
  messages: { type: [MessageSchema], required: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;
