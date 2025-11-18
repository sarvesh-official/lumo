'use client'

import { useState, useEffect } from 'react'
import { LoaderIcon, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, useSidebar } from '../components/ui/sidebar'
import { ChatItem } from './app-sidebar'
import { usePathname } from 'next/navigation'
import { useChatContext } from '../lib/chat-context'

interface ChatData {
  _id: string
  title: string
  messages: { id: string; role: string; content: string }[]
  createdAt: string
}

export function SidebarHistory() {
  const { setOpenMobile } = useSidebar()
  const [isLoading, setIsLoading] = useState(true)
  const [chats, setChats] = useState<ChatData[]>([])
  const pathname = usePathname()
  const [refreshKey, setRefreshKey] = useState(0)
  const { lastRefresh } = useChatContext()

  const getHistory = async () => {
    try {
      const res = await fetch('/api/history', { 
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' } 
      })
      if (!res.ok) throw new Error('Failed to fetch history')
      const data = await res.json()
      return data.chats as ChatData[]
    } catch (err) {
      console.error('Failed to fetch history:', err)
      toast.error('Failed to load history')
      return []
    }
  }

  const refreshHistory = async () => {
    setIsLoading(true)
    const data = await getHistory()
    setChats(data)
    setIsLoading(false)
  }

  useEffect(() => {
    refreshHistory()
  }, [pathname, refreshKey, lastRefresh])

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="flex justify-between items-center px-2 py-1 mb-2">
          <span className="text-sm font-medium">Recent Chats</span>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)} 
            className="p-1 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground"
            disabled={isLoading}
            title="Refresh chat history"
          >
            <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <SidebarMenu>
          <div className="flex flex-col gap-3">
            {chats.map((chat) => {
              return (
                <ChatItem
                  key={chat._id}
                  id={chat._id}
                  name={chat.title || 'New chat'}
                  active={pathname?.includes(chat._id) || false}
                  onClick={() => setOpenMobile(false)}
                />
              )
            })}
            {chats.length === 0 && !isLoading && (
              <div className="text-sm text-muted-foreground p-2">No chats yet</div>
            )}
          </div>
        </SidebarMenu>
      </SidebarGroupContent>

      {isLoading && (
        <div className="p-2 text-muted-foreground flex flex-row gap-2 items-center mt-8">
          <div className="animate-spin">
            <LoaderIcon className="size-4" />
          </div>
          <div>Loading chats…</div>
        </div>
      )}
    </SidebarGroup>
  )
}
