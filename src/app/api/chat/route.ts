import {auth} from "@clerk/nextjs/server";
import { openai } from "@ai-sdk/openai";
import {convertToModelMessages, streamText, UIMessage, generateId, stepCountIs} from "ai";
import { saveChatToDb, saveFlashcardsToDB } from "@/src/lib/db";
import { z } from "zod";
import mongoose from "mongoose";

export async function POST(req: Request) {
    
    try{

        const {userId} = await auth();
        
        if(!userId) return new Response("Unauthorized", {status: 401});
        
        const body = await req.json();
        const messages: UIMessage[] = body.messages || [];
        const chatId: string | undefined = body.chatId;
        
        const response = await streamText({
            model: openai('gpt-4'),
            messages: convertToModelMessages(messages),
            system: "You are a friendly and knowledgeable science tutor who explains concepts clearly. When users ask you to create flashcards from the conversation, use the generateFlashcards tool. After creating flashcards, always confirm to the user that the flashcards have been generated and saved.",
            stopWhen: stepCountIs(5),
            tools: {
                generateFlashcards: {
                    description: "Generate flashcards based on the conversation. Use this when the user asks to create flashcards, make flashcards, or generate study cards from the chat.",
                    inputSchema: z.object({
                        cards: z.array(z.object({
                            question: z.string().describe("The question for the flashcard"),
                            answer: z.string().describe("The answer to the question")
                        })).describe("Array of flashcard questions and answers generated from the conversation")
                    }),
                    execute: async ({ cards }) => {
                        try {
                            let flashcardChatId;
                            try {
                                flashcardChatId = chatId ? new mongoose.Types.ObjectId(chatId) : new mongoose.Types.ObjectId();
                            } catch (err) {
                                console.error('Invalid ObjectId format:', err);
                                flashcardChatId = new mongoose.Types.ObjectId();
                            }
                            await saveFlashcardsToDB({ 
                                userId, 
                                chatId: flashcardChatId, 
                                cards 
                            });
                            return {
                                success: true,
                                cardsGenerated: cards.length,
                                message: `Successfully generated and saved ${cards.length} flashcards!`
                            };
                        } catch (error) {
                            console.error("Error saving flashcards:", error);
                            return {
                                success: false,
                                cardsGenerated: 0,
                                message: "Failed to save flashcards"
                            };
                        }
                    }
                }
            },
            onFinish: async ({ text }) => {
                const assistantMessage: UIMessage = {
                    id: generateId(),
                    role: 'assistant',
                    parts: [{ type: 'text', text }]
                };
                const updatedMessages = [...messages, assistantMessage];
                await saveChatToDb(userId, updatedMessages, chatId).catch((err) => {
                    console.log(err);
                });
            }
        });
        
        return response.toUIMessageStreamResponse();
    }catch (error){
        console.error("Chat route error", error);
        return new Response("Internal Server Error", {status: 500})
    }
}