import { auth } from "@clerk/nextjs/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    const { message } = await req.json();
    
    const { text } = await generateText({
      model: openai('gpt-4'),
      prompt: `Based on this message: ${message}\n\nGenerate a concise chat title using 3-6 words. Return ONLY the title text with no quotes, punctuation, or formatting. Example format: Learning Python Basics`,
      maxOutputTokens: 20
    });
    
    const cleanedTitle = text.trim()
      .replace(/^["'`\\]+|["'`\\]+$/g, '')
      .replace(/\\"/g, '"')
      .trim();
    
    return Response.json({ title: cleanedTitle });
  } catch (error) {
    console.error("Title generation error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
