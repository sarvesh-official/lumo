import { auth } from "@clerk/nextjs/server";
import { saveChatToDb } from "@/src/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    const { title } = await req.json();
    
    const chat = await saveChatToDb(userId, [], undefined, title);
    
    if (!chat) {
      return new Response("Failed to create chat", { status: 500 });
    }
    
    return Response.json({ chatId: String(chat._id) });
  } catch (error) {
    console.error("Chat creation error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
