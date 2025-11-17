'use client';


import { useRouter } from 'next/navigation';
import { useWindowSize } from 'react-use';

import { SidebarToggle } from '../components/sidebar-toggle';
import { Button } from '../components/ui/button';
import { useSidebar } from './ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MessageSquarePlus } from 'lucide-react';
import { ThemeToggleButton } from './theme-toggle-button';

export function ChatHeader() {

  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 text-foreground justify-between z-20">
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
        <SidebarToggle />

        {(!open || windowWidth < 768) && (
          <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              className="p-2 h-fit text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => {
                router.push('/');
                router.refresh();
              }}
            >
              <div className="size-5 overflow-hidden">
                <MessageSquarePlus/>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent align="end">New Chat</TooltipContent>
        </Tooltip>
        )}

      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggleButton
        />
      </div>
    </header>
  );
}
