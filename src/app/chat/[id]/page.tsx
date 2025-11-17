'use client';

import { useChat } from '@ai-sdk/react';
import { SidebarProvider } from '@/src/components/ui/sidebar';
import { AppSidebar } from '@/src/components/app-sidebar';
import { ChatHeader } from '@/src/components/chat-header';
import { Messages } from '@/src/components/messages';
import { ChatInput } from '@/src/components/ui/chat-input';
import { FlashcardPanel } from '@/src/components/flashcard-panel';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/src/components/ui/button';
import { BookOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip';

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const chatId = params.id as string;
  const initialMessage = searchParams.get('initialMessage');
  const hasInitialized = useRef(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  
  const handleToolCall = useCallback(async ({ toolCall }: { toolCall: { toolName: string } }) => {
    console.log('Tool called:', toolCall);
    if (toolCall.toolName === 'generateFlashcards') {
      console.log('Flashcard tool called, opening panel');
      setShowFlashcards(true);
    }
  }, []);
  
  const { messages, sendMessage, status, setMessages } = useChat({
    onToolCall: handleToolCall,
  });
  
  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      console.log('Last message:', lastMsg);
      if (lastMsg.parts) {
        console.log('Message parts:', lastMsg.parts);
      }
    }
  }, [messages]);
  
  useEffect(() => {
    const loadChat = async () => {
      try {
        const res = await fetch(`/api/chat/${chatId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          } else if (initialMessage && !hasInitialized.current) {
            hasInitialized.current = true;
            sendMessage({ 
              role: 'user', 
              parts: [{ type: 'text', text: initialMessage }]
            }, {
              body: { chatId }
            });
          }
        }
      } catch (error) {
        console.error('Failed to load chat:', error);
      }
    };
    
    if (chatId) {
      loadChat();
    }
  }, [chatId, initialMessage, setMessages, sendMessage]);
  
  const handleSend = (text: string) => {
    sendMessage({ 
      role: 'user', 
      parts: [{ type: 'text', text }]
    }, {
      body: { chatId }
    });
  };
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <ChatHeader />
          <div className="flex-1 min-h-0 overflow-hidden relative bg-background">
            <div className="h-full overflow-auto" id="messages-scroll-container">
              <div className="mx-auto w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl">
                <Messages 
                  messages={messages} 
                  isTyping={isLoading}
                />
              </div>
            </div>
          </div>
          <div className="p-4 sticky bottom-0 z-10">
            <div className="mx-auto w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl flex gap-2">
              <ChatInput 
                onSend={handleSend}
                isDisabled={isLoading}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowFlashcards(!showFlashcards)}
                    className="shrink-0"
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {showFlashcards ? 'Hide Flashcards' : 'Show Flashcards'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        <FlashcardPanel 
          chatId={chatId}
          isOpen={showFlashcards}
          onClose={() => setShowFlashcards(false)}
        />
      </div>
    </SidebarProvider>
  );
}
