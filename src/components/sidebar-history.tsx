'use client'

import { useState, useEffect } from 'react'
import { LoaderIcon } from 'lucide-react'
import { toast } from 'sonner'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, useSidebar } from '../components/ui/sidebar'
import { ChatItem } from './app-sidebar'

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

  const getHistory = async () => {
    try {
      const res = await fetch('/api/history', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch history')
      const data = await res.json()
      return data.chats as ChatData[]
    } catch (err) {
      console.error('Failed to fetch history:', err)
      toast.error('Failed to load history')
      return []
    }
  }

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true)
      const data = await getHistory()
      setChats(data)
      setIsLoading(false)
    }
    fetchChats()
  }, [])

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <div className="flex flex-col gap-3">
            {chats.map((chat) => {
              return (
                <ChatItem
                  key={chat._id}
                  id={chat._id}
                  name={chat.title || 'New chat'}
                  active={false}
                  onClick={() => setOpenMobile(false)}
                />
              )
            })}
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
