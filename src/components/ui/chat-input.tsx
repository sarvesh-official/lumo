'use client';

import { useState, useRef, useEffect } from 'react';

import { PaperclipIcon, ArrowDown } from 'lucide-react';

import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './button';
import { Textarea } from './textarea';
import { cn } from '@/src/lib/utils';
import { ArrowUpIcon } from './icons';

interface ChatInputProps {
  onSend?: (message: string) => void;
  isDisabled?: boolean;
}

export function ChatInput({ onSend, isDisabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    };

    adjustHeight();
    return () => {};
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isDisabled) return;
    
    onSend?.(message);
    setMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative w-full flex flex-col gap-4">
      <AnimatePresence>
        {false && ( // We're not implementing scroll functionality here, just matching styles
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute left-1/2 bottom-28 -translate-x-1/2 z-50"
          >
            <Button
              className="rounded-full"
              size="icon"
              variant="outline"
            >
              <ArrowDown />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="relative w-full">
        <Textarea
          ref={textareaRef}
          placeholder="Send a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          className={cn(
            'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 border-input focus-visible:ring-0 focus-visible:ring-offset-0'
          )}
          autoComplete="off"
          rows={2}
          autoFocus
        />

        <div className="absolute bottom-0 p-2 w-fit flex flex-row justify-start">
          <Button 
            type="button" 
            className="rounded-md rounded-bl-lg p-[7px] h-fit border-input hover:bg-accent hover:text-accent-foreground"
            variant="ghost"
            disabled={isDisabled}
            aria-label="Attach file"
          >
            <PaperclipIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
          <Button 
            type="submit" 
            disabled={!message.trim() || isDisabled}
            className="rounded-full p-1.5 h-fit border border-input"
            aria-label="Send message"
          >
            <ArrowUpIcon size={14} />
          </Button>
        </div>
      </form>
    </div>
  );
}
