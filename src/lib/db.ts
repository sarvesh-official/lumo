import mongoose from "mongoose"
import { FlashcardData } from "../types/chat";
import Chat from "../models/Chat";
import Flashcard from "../models/Flashcard";
import { UIMessage } from "ai";

const uri = process.env.MONGODB_URI!;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(uri, {
    dbName: "lumo",
  });
};


// ------ Chat Helpers


export async function saveChatToDb(userId: string, messages: UIMessage[]) {

  try {

    await connectDB();
    const chat = await Chat.create({ userId, messages })

    return chat;

  } catch (error) {
    console.error("Error saving chat to DB:", error);
    throw error;
  }
}


export async function getUserChat(userId: string) {
  try {

    await connectDB();
    const chats = await Chat.find({userId}).sort({ createdAt: -1});
    
    return chats;

  } catch (error) {

    console.error("Error fetching chats: ", error);
    throw error;
  }
}


// ------- Flashcard Helpers

export async function saveFlashcardsToDB({userId, chatId, cards} : FlashcardData) {
  
  try{

    await connectDB();
    const flashCard = await Flashcard.create({
      userId,
      chatId,
      cards
    });

    return flashCard;

  }catch (error){

    console.error("Error saving flashcards", error);
    throw error;
  }
}

export async function getUserFlashcards(userId:string) {
  try{

    await connectDB();

    const flashcards = await Flashcard.find({userId}).sort({createdAt: -1});
    return flashcards;

  }catch (error){
    console.error("Error fetching flashcards", error);
    throw error;
  }
}

export async function getFlashcardsByChatId(chatId:string) {
  
  try{

    await connectDB();
    const flashcards = await Flashcard.find({chatId}).sort({createdAt: -1});

    return flashcards;

  }catch (error){

    console.error("Error fetching flashcards by chatId",error);
    throw error;
  }
}