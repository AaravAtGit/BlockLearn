"use client"

import { useState, useRef, useEffect } from "react"
import { Groq } from "groq-sdk"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, Trash2, CornerDownLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function BlockLearnAI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Focus input on load
    inputRef.current?.focus()
    
    // Add welcome message if no messages exist
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "👋 Welcome to BlockLearn AI! I'm here to help you understand blockchain technology, cryptocurrency, and Web3 development. What would you like to learn about today?",
          timestamp: new Date()
        }
      ])
    }
  }, [])

  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)
    
    // Maintain focus immediately after clearing input
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })

    setMessages((prev) => [...prev, { 
      role: "user", 
      content: userMessage,
      timestamp: new Date()
    }])

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable blockchain expert assistant. Help users understand blockchain concepts, development, and applications. Keep responses clear, accurate, and educational created by BlockLearn, A platform created by AaravAtGit. Only answer questions related to blockchain, crypto, and Web3. Do not provide any other information.",
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: "user",
            content: userMessage,
          },
        ],
        model: "llama3-70b-8192",
        temperature: 0.5,
        max_tokens: 1024,
      })

      const assistantMessage = completion.choices[0]?.message?.content || "Sorry, I couldn't process that."
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: assistantMessage,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "Sorry, there was an error processing your request. Please check your connection and try again.",
          timestamp: new Date()
        },
      ])
    } finally {
      setIsLoading(false)
      // Ensure focus is maintained after async operation
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }

  const clearConversation = () => {
    setMessages([{
      role: "assistant",
      content: "Chat cleared. What blockchain topic would you like to explore?",
      timestamp: new Date()
    }])
    // Refocus input after clearing
    inputRef.current?.focus()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">BlockLearn AI</h1>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={clearConversation}
                className="hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear conversation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Card className="flex-grow mb-4 border border-gray-700 shadow-sm overflow-hidden bg-gray-800">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  message.role === "assistant" ? "items-start" : "items-end"
                }`}
              >
                <div className="flex items-center mb-1 space-x-2">
                  <Badge 
                    variant={message.role === "assistant" ? "secondary" : "default"}
                    className={`text-xs ${
                      message.role === "assistant" ? "bg-blue-200 text-blue-900" : "bg-green-200 text-green-900"
                    }`}
                  >
                    {message.role === "assistant" ? "BlockLearn AI" : "You"}
                  </Badge>
                  <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                </div>
                <div
                  className={`max-w-3xl rounded-lg p-3 ${
                    message.role === "assistant"
                      ? "bg-gray-700 text-gray-100 border border-gray-600"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </Card>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="relative flex-grow">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about blockchain, crypto, or Web3..."
            disabled={isLoading}
            className="pr-10 border-2 border-gray-600 focus:border-blue-400 bg-gray-800 text-white placeholder:text-gray-400"
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 border border-gray-600 rounded-md">⏎</kbd>
          </div>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}