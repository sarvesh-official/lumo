'use client';

import { useChat } from '@ai-sdk/react';
import { generateId, UIMessage } from 'ai';
import { SidebarProvider } from '@/src/components/ui/sidebar';
import { AppSidebar } from '@/src/components/app-sidebar';
import { ChatHeader } from '@/src/components/chat-header';
import { Messages } from '@/src/components/messages';
import { ChatInput } from '@/src/components/ui/chat-input';
import { FlashcardPanel, FlashcardPanelRef } from '@/src/components/flashcard-panel';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/src/components/ui/button';
import { BookOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip';
import { useChatContext } from '@/src/lib/chat-context';

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const chatId = params.id as string;
  const initialMessage = searchParams.get('initialMessage');
  const hasInitialized = useRef(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [hasCheckedFlashcards, setHasCheckedFlashcards] = useState(false);
  const flashcardPanelRef = useRef<FlashcardPanelRef>(null);
  const { refreshSidebar } = useChatContext();
  
  const checkForFlashcards = useCallback(async () => {
    if (!chatId || hasCheckedFlashcards) return;
    
    try {
      const response = await fetch(`/api/flashcards/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.cards && data.cards.length > 0) {
          setShowFlashcards(true);
        }
      }
      setHasCheckedFlashcards(true);
    } catch (error) {
      console.error('Failed to check for flashcards:', error);
    }
  }, [chatId, hasCheckedFlashcards]);

  const handleToolCall = useCallback(async ({ toolCall }: { toolCall: { toolName: string } }) => {
    console.log('Tool called:', toolCall);
    if (toolCall.toolName === 'generateFlashcards') {
      console.log('Flashcard tool called, opening panel');
      setShowFlashcards(true);
      
      setTimeout(() => {
        if (flashcardPanelRef.current) {
          flashcardPanelRef.current.refresh();
        }
      }, 1000);
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
    if (chatId && !hasCheckedFlashcards) {
      checkForFlashcards();
    }
  }, [chatId, hasCheckedFlashcards, checkForFlashcards]);

  useEffect(() => {
    const loadChat = async () => {
      try {
        const res = await fetch(`/api/chat/${chatId}`);
        
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
            hasInitialized.current = true;
          }
        } else if (res.status === 404 && initialMessage && !hasInitialized.current) {
          hasInitialized.current = true;
          
          const titleRes = await fetch('/api/chat/title', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: initialMessage })
          });

          if (!titleRes.ok) throw new Error('Failed to generate title');
          const { title } = await titleRes.json();
          
          const chatRes = await fetch('/api/chat/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chatId,
              title,
              initialMessage
            })
          });

          if (!chatRes.ok) throw new Error('Failed to create chat');
          
          const chatData = await chatRes.json();
          
          if (chatData.exists) {
            const refreshRes = await fetch(`/api/chat/${chatId}`);
            if (refreshRes.ok) {
              const data = await refreshRes.json();
              if (data.messages && data.messages.length > 0) {
                setMessages(data.messages);
              }
            }
          } else {
            refreshSidebar();
            sendMessage({
              role: 'user',
              parts: [{ type: 'text', text: initialMessage }]
            }, {
              body: { chatId }
            });
          }
        } else if (res.status === 404) {
          console.log('Chat not found, and no initial message to create it');
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
          ref={flashcardPanelRef}
          chatId={chatId}
          isOpen={showFlashcards}
          onClose={() => setShowFlashcards(false)}
        />
      </div>
    </SidebarProvider>
  );
}
