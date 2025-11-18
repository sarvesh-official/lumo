import { auth } from "@clerk/nextjs/server";
import { getChatById } from "@/src/lib/db";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    const { id } = await params;
    
    if (!mongoose.isValidObjectId(id)) {
      return new Response("Invalid chat ID format", { status: 400 });
    }
    
    const chat = await getChatById(id);
    
    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }
    
    if (chat.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }
    
    return Response.json({ 
      messages: chat.messages,
      title: chat.title 
    });
  } catch (error) {
    console.error("Get chat error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
