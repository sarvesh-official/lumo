'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { Sparkle } from 'lucide-react'; 
import { cn } from '../lib/utils';
import { UIMessage } from 'ai';

interface TextPart {
  type: 'text';
  text: string;
}

function getMessageContent(message: UIMessage): { content: string; hasToolCall: boolean; hasToolResult: boolean } {
  const msgWithDisplay = message as UIMessage & { display?: string | React.ReactNode };
  
  let hasToolCall = false;
  let hasToolResult = false;
  
  if (message.parts) {
    message.parts.forEach((part) => {
      const partAny = part as unknown as { type?: string; toolName?: string };
      const partType = partAny.type;
      const toolName = partAny.toolName;
      if ((partType === 'tool-call' || partType === 'tool-invocation') && toolName === 'generateFlashcards') {
        hasToolCall = true;
      }
      if (partType === 'tool-result' && toolName === 'generateFlashcards') {
        hasToolResult = true;
      }
    });
  }
  
  if (typeof msgWithDisplay.display === 'string') {
    return { content: msgWithDisplay.display, hasToolCall, hasToolResult };
  }
  
  if (message.parts) {
    const content = message.parts
      .filter((part): part is TextPart => (part as TextPart).type === 'text')
      .map((part) => part.text)
      .join('');
    return { content, hasToolCall, hasToolResult };
  }
  
  return { content: '', hasToolCall, hasToolResult };
}

export interface MessageProps {
  id: string;
  content: string;
  role: "currentUser" | "others";
  profileUrl: string;
  username: string;
  timestamp: Date;
}

function PureMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { content, hasToolCall, hasToolResult } = getMessageContent(message);
  const isUser = message.role === 'user';
  const username = isUser ? 'You' : 'AI Tutor';
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(new Date());

  return (
    <motion.div
      data-testid={`message-${message.role}`}
      className={cn(
        "w-full mx-auto max-w-4xl px-4 group/message pb-4",
        isUser ? "items-end" : "items-start"
      )}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div 
        className={cn(
          "flex flex-col",
          isUser 
            ? "max-w-[80%] ml-auto items-end" 
            : "max-w-[80%] items-start"
        )}
      >
        <div className={cn(
          "flex items-center gap-2 mb-1",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <div className="w-6 h-6 flex items-center rounded-full justify-center shrink-0 ring-1 ring-border overflow-hidden"
            style={isUser ? {backgroundColor: "var(--primary)"} : {backgroundColor: "var(--background)"}}
          >
            <div className="font-semibold text-xs"
              style={isUser ? {color: "var(--primary-foreground)"} : {}}
            >
              {isUser ? <Sparkle className="h-3 w-3" /> : <Sparkle className="h-3 w-3" />}
            </div>
          </div>
          <span className="font-medium text-foreground text-sm">{username}</span>
        </div>
        
        {hasToolCall && !hasToolResult && !content && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 mb-2">
            <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-700 dark:text-blue-300">Creating flashcards...</span>
          </div>
        )}
        
        {hasToolResult && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 mb-2">
            <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-700 dark:text-green-300">Flashcards created successfully!</span>
          </div>
        )}
        
        {content && (
          <div 
            className={cn(
              "px-4 py-3 rounded-xl break-words inline-block max-w-full whitespace-pre-wrap",
              isUser 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-foreground",
              content.length < 20 ? "w-auto" : "w-full"
            )}
          >
            {content.split('\n').map((line, i) => {
              if (/^\d+\.\s\*\*/.test(line)) {
                const match = line.match(/^(\d+)\.\s\*\*(.+?)\*\*:\s*(.*)$/);
                if (match) {
                  return (
                    <div key={i} className="mb-2">
                      <span className="font-semibold">{match[1]}. {match[2]}:</span> {match[3]}
                    </div>
                  );
                }
              }
              if (line.includes('**')) {
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                  <div key={i} className={line ? "mb-2" : ""}>
                    {parts.map((part, j) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                      }
                      return <span key={j}>{part}</span>;
                    })}
                  </div>
                );
              }
              return line ? <div key={i} className="mb-2">{line}</div> : <div key={i} className="mb-1"></div>;
            })}
          </div>
        )}
        
        <span className="text-xs text-muted-foreground mt-1">{formattedTime}</span>
      </div>
    </motion.div>
  );
}

export const Message = memo(PureMessage);

export function ThinkingMessage() {
  return (
    <div className="w-full mx-auto max-w-4xl px-4 pb-2">
      <div className="flex flex-col max-w-[80%]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 flex items-center rounded-full justify-center shrink-0 ring-1 ring-border bg-background overflow-hidden">
            <Sparkle className="h-3 w-3" />
          </div>
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="h-10 w-full max-w-md bg-muted rounded-xl animate-pulse" />
        
        <div className="h-3 w-16 bg-muted rounded animate-pulse mt-1 self-start" />
      </div>
    </div>
  );
}
