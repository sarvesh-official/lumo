import { auth } from "@clerk/nextjs/server";
import { saveChatToDb, getChatById } from "@/src/lib/db";
import { generateId, UIMessage } from "ai";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { title, chatId, initialMessage } = await req.json();
    let messages: UIMessage[] = [];
    if (initialMessage) {
      messages = [{
        id: generateId(),
        role: 'user',
        parts: [{ type: 'text', text: initialMessage }]
      }];
    }
    let validatedChatId = chatId;
    if (chatId && !mongoose.isValidObjectId(chatId)) {
      console.warn(`Invalid ObjectId format for chatId: ${chatId}, creating new ID`);
      validatedChatId = new mongoose.Types.ObjectId().toString();
    }
    
    if (validatedChatId) {
      const existingChat = await getChatById(validatedChatId);
      if (existingChat && existingChat.userId === userId) {
        return Response.json({ chatId: validatedChatId, exists: true });
      }
    }
    
    const chat = await saveChatToDb(userId, messages, validatedChatId, title);
    if (!chat) {
      return new Response("Failed to create chat", { status: 500 });
    }
    return Response.json({ chatId: String(chat._id) });
  } catch (error) {
    console.error("Chat creation error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
