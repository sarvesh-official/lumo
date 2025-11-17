"use client"

import React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "../components/ui/button"

import {
  AnimationStart,
  AnimationVariant,
  createAnimation,
} from "../components/theme/theme-animations"

export const THEME_TOGGLE_GIFS = [
  "https://media.giphy.com/media/KBbr4hHl9DSahKvInO/giphy.gif?cid=790b76112m5eeeydoe7et0cr3j3ekb1erunxozyshuhxx2vl&ep=v1_stickers_search&rid=giphy.gif&ct=s",
  "https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3JwcXdzcHd5MW92NWprZXVpcTBtNXM5cG9obWh0N3I4NzFpaDE3byZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/WgsVx6C4N8tjy/giphy.gif",
  "https://media.giphy.com/media/ArfrRmFCzYXsC6etQX/giphy.gif?cid=ecf05e47kn81xmnuc9vd5g6p5xyjt14zzd3dzwso6iwgpvy3&ep=v1_stickers_search&rid=giphy.gif&ct=s",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWI1ZmNvMGZyemhpN3VsdWp4azYzcWUxcXIzNGF0enp0eW1ybjF0ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/Fa6uUw8jgJHFVS6x1t/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGlkaG40MTA2MWE0em0wZ2NjcGtwZXFsdThpZHZtaXNyNThxamUydCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/FopJy18z4t5hHlViZn/giphy.gif",
]

interface ThemeToggleAnimationProps {
  variant?: AnimationVariant
  start?: AnimationStart
  url?: string
  randomize?: boolean
}

export function ThemeToggleButton({
  variant = "circle-blur",
  start = "top-left",
  url = "",
  randomize = false
}: ThemeToggleAnimationProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getRandomAnimation = React.useCallback(() => {
    const variants: AnimationVariant[] = ["circle-blur", "circle", "gif"]
    const positions: AnimationStart[] = ["top-left", "top-right", "bottom-left", "bottom-right"]
    
    const randomVariant = variants[Math.floor(Math.random() * variants.length)]
    const randomPosition = positions[Math.floor(Math.random() * positions.length)]
    
    const randomGifUrl = randomVariant === "gif" 
      ? THEME_TOGGLE_GIFS[Math.floor(Math.random() * THEME_TOGGLE_GIFS.length)]
      : ""
    
    return { 
      variant: randomVariant, 
      start: randomPosition,
      url: randomGifUrl
    }
  }, [])

  const styleId = "theme-transition-styles"

  const updateStyles = React.useCallback((css: string) => {
    if (typeof window === "undefined") return

    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = css
  }, [])

  const toggleTheme = React.useCallback(() => {

    let animVariant = variant
    let animStart = start
    let animUrl = url
    
    if (randomize) {
      const randomAnim = getRandomAnimation()
      animVariant = randomAnim.variant
      animStart = randomAnim.start
      
      if (randomAnim.variant === "gif" && randomAnim.url) {
        animUrl = randomAnim.url
      }
    }
    
    const animation = createAnimation(animVariant, animStart, animUrl)
    updateStyles(animation.css)

    if (typeof window === "undefined") return

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light")
    }

    if (!document.startViewTransition) {
      switchTheme()
      return
    }

    try {
      const transition = document.startViewTransition(switchTheme)
      transition.ready.catch(() => switchTheme())
    } catch {
      switchTheme()
    }
  }, [theme, setTheme, variant, start, url, randomize, getRandomAnimation, updateStyles])

  if (!mounted) {
    return null
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="w-9 p-0 h-9 relative group"
      name="Theme Toggle Button"
    >
      <SunIcon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Theme Toggle</span>
    </Button>
  )
}
