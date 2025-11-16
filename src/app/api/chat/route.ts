import {auth} from "@clerk/nextjs/server";
import { openai } from "@ai-sdk/openai";
import {convertToModelMessages, streamText, UIMessage} from "ai";

export async function POST(req: Request) {
    
    const {userId} = await auth();

    if(!userId) return new Response("Unauthorized", {status: 401});

    const {messages} : {messages : UIMessage[]} = await req.json();

    const response = await streamText({
        model: openai('gpt-4'),
        messages: convertToModelMessages(messages)
    });

    return response.toUIMessageStreamResponse();
}