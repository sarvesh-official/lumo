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
    
   
    if (!mongoose.isValidObjectId(chatId)) {
      return Response.json({ error: "Invalid chat ID format" }, { status: 400 });
    }
    
    await connectDB();

    try {
      const flashcards = await Flashcard.find({
        userId,
        chatId: new mongoose.Types.ObjectId(chatId),
      }).sort({ createdAt: -1 });

      const allCards = flashcards.flatMap((fc) => fc.cards);

      return Response.json({ cards: allCards });
    } catch (conversionError) {
      console.error("Error with ObjectId conversion:", conversionError);
      return Response.json(
        { error: "Invalid chat ID format" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error with GET request:", error);
    return Response.json(
      { error: "Failed to process GET request" },
      { status: 500 }
    );
  }
}
