'use client';

import { useState } from 'react';
import { SidebarProvider } from '../components/ui/sidebar';
import { AppSidebar } from '../components/app-sidebar';
import { ChatHeader } from '../components/chat-header';
import { Messages } from '../components/messages';
import { ChatInput } from '../components/ui/chat-input';
import { useRouter } from 'next/navigation';

export default function Chat() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  
  const handleSend = async (text: string) => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {

      const titleRes = await fetch('/api/chat/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      
      if (!titleRes.ok) throw new Error('Failed to generate title');
      
      const { title } = await titleRes.json();
      
 
      const chatRes = await fetch('/api/chat/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title
        })
      });
      
      if (!chatRes.ok) throw new Error('Failed to create chat');
      
      const { chatId } = await chatRes.json();
      
      router.push(`/chat/${chatId}?initialMessage=${encodeURIComponent(text)}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
      setIsCreating(false);
    }
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
                  messages={[]} 
                  isTyping={false}
                />
              </div>
            </div>
          </div>
          <div className="p-4 sticky bottom-0 z-10">
            <div className="mx-auto w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl">
              <ChatInput 
                onSend={handleSend}
                isDisabled={isCreating}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}