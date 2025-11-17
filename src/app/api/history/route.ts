import { getUserChat } from "@/src/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const chats = await getUserChat(userId);
    return new Response(JSON.stringify({ chats }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("History route error", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}