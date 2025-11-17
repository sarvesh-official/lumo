'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquarePlus, Users } from 'lucide-react';

import { Button } from '../components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '../components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { SidebarHistory } from './sidebar-history';
import { SidebarUserNav } from './sidebar-user-nav';


export function AppSidebar() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0 bg-sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <div className="flex items-center gap-2">
                <div className="size-6 overflow-hidden">
                  <Image src="/icon.png" alt="Lumo" width={24} height={24} className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-semibold hover:bg-sidebar-accent rounded-md cursor-pointer text-sidebar-foreground">
                  Lumo
                </span>
              </div>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={() => {
                    setOpenMobile(false);
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
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserNav />
      </SidebarFooter>
    </Sidebar>
  );
}

export function ChatItem({
  id,
  name,
  active,
  onClick,
  memberCount = 0,
}: {
  id: string;
  name: string;
  active: boolean;
  onClick: () => void;
  memberCount?: number;
}) {
  return (
    <Link
      href={`/chat/${id}`}
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded-md transition-colors bg-gray-400/10 dark:bg-gray-400/5 ${active ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'}`}
    >
      <div className="w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm truncate">{name}</span>
          {memberCount > 0 && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              <span>{memberCount}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
