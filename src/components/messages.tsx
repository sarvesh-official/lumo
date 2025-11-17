'use client';

import { memo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Message, ThinkingMessage } from './message';
import { UIMessage } from 'ai';

interface MessagesProps {
  messages: UIMessage[];
  isTyping?: boolean;
  roomName?: string;
  isPrivate?: boolean;
  chatId?: string;
}

function PureMessages({
  messages,
  isTyping = false,
  roomName = 'General',
}: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [userScrolling, setUserScrolling] = useState(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isBottom = scrollHeight - scrollTop - clientHeight < 10;
    setIsAtBottom(isBottom);
    
    setUserScrolling(true);
    
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setUserScrolling(false);
    }, 150);
  };
  
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const container = document.getElementById('messages-scroll-container');
    if (container) {
      scrollContainerRef.current = container;
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const lastMessageLengthRef = useRef(messages.length);
  
  useEffect(() => {

    const hasNewMessage = messages.length > lastMessageLengthRef.current;
    lastMessageLengthRef.current = messages.length;
    
    if (messagesEndRef.current && hasNewMessage && isAtBottom && !userScrolling) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, userScrolling]);

  return (
    <div className="relative flex flex-col flex-1 h-full overflow-hidden bg-background">
      <div
        className="flex flex-col min-w-0 gap-6 flex-1 h-full p-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">No messages yet</h2>
            <p className="text-muted-foreground mt-2">Start a new conversation to get help or ask a question.</p>
            <p className="text-muted-foreground">Type your message below to begin.</p>
          </div>
        )}

        {messages.length > 0 && (
          <div className="pb-2">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                Today
              </div>
            </div>
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
              />
            ))}
          </div>
        )}

        {isTyping && <ThinkingMessage />}

        <motion.div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>

      {!isAtBottom && messages.length > 0 && (
        <div className="fixed bottom-20 right-4 z-10">
          <Button
            onClick={scrollToBottom}
            size="icon"
            variant="secondary"
            className="rounded-full shadow-md h-10 w-10 bg-secondary hover:bg-secondary/80 text-secondary-foreground border-none"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export const Messages = memo(PureMessages);
