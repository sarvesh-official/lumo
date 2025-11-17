'use client';

import { ChevronUp } from 'lucide-react';
import {useAuth, useUser } from '@clerk/nextjs';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../components/ui/sidebar';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';

export function SidebarUserNav() {
  const { user } = useUser();
  const { signOut } = useAuth()

  const displayName = user?.fullName || user?.username || user?.firstName || 'Guest';
  const avatarId = user?.fullName || user?.username || user?.firstName || 'Lumo';
  

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              data-testid="user-nav-button"
              className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10"
            >
              <div className="size-8 flex items-center rounded-full justify-center bg-sidebar-accent text-sidebar-foreground">
                <Image
                  src={user?.imageUrl || `https://avatar.vercel.sh/${avatarId}`}
                  alt={displayName}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
              <span data-testid="user-email" className="truncate">
                {displayName}
              </span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            data-testid="user-nav-menu"
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem asChild data-testid="user-nav-item-auth" className='cursor-pointer' onClick={()=> signOut()}>
              <h1>Sign Out</h1>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
