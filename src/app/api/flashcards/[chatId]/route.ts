import { auth } from "@clerk/nextjs/server";
import Flashcard from "@/src/models/Flashcard";
import mongoose from "mongoose";
import { connectDB } from "@/src/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await params;
    
    await connectDB();

    const flashcards = await Flashcard.find({
      userId,
      chatId: new mongoose.Types.ObjectId(chatId),
    }).sort({ createdAt: -1 });

    const allCards = flashcards.flatMap((fc) => fc.cards);

    return Response.json({ cards: allCards });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return Response.json(
      { error: "Failed to fetch flashcards" },
      { status: 500 }
    );
  }
}
