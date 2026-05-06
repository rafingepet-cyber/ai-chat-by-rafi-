"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import { Sparkles, Code2, MessageCircle, Zap, Shield, Cpu } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, activeChat, isLoading]);

  const getActiveMessages = (): Message[] => {
    if (!activeChat) return [];
    const chat = chats.find((c) => c.id === activeChat);
    return chat?.messages || [];
  };

  const generateTitle = (content: string): string => {
    const clean = content.replace(/[#*`]/g, "").trim();
    return clean.length > 30 ? clean.substring(0, 30) + "..." : clean || "Chat Baru";
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: "Chat Baru",
      messages: [],
      timestamp: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
  };

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChat === id) {
      const remaining = chats.filter((c) => c.id !== id);
      setActiveChat(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChat) {
      const newChat: Chat = {
        id: uuidv4(),
        title: generateTitle(content),
        messages: [],
        timestamp: new Date(),
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChat(newChat.id);
      
      setTimeout(() => {
        sendMessageToApi(newChat.id, content, []);
      }, 100);
      return;
    }

    const chat = chats.find((c) => c.id === activeChat);
    const previousMessages = chat?.messages || [];
    sendMessageToApi(activeChat, content, previousMessages);
  };

  const sendMessageToApi = async (
    chatId: string,
    content: string,
    previousMessages: Message[]
  ) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [...c.messages, userMessage],
              title: c.title === "Chat Baru" ? generateTitle(content) : c.title,
            }
          : c
      )
    );

    setIsLoading(true);

    try {
      const apiMessages = previousMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...apiMessages, { role: "user", content }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Gagal mendapatkan response dari AI");
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || "Maaf, saya tidak bisa memproses pesanmu.";

      const aiMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, aiMessage] }
            : c
        )
      );
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: `❌ **Error:** ${error.message || "Terjadi kesalahan. Coba lagi nanti."}\n\nPastikan:\n- Koneksi internet stabil\n- API key masih valid\n- Coba refresh halaman`,
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, errorMessage] }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const activeMessages = getActiveMessages();
  const hasActiveChat = activeChat !== null && activeMessages.length > 0;

  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      <Sidebar
        chats={chats.map((c) => ({
          id: c.id,
          title: c.title,
          timestamp: c.timestamp,
        }))}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex-1 flex flex-col h-full">
        {!hasActiveChat && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-lg">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Selamat Datang di Rafi AI
              </h2>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                Asisten AI pintar yang bisa ngobrol, bikin kode, dan bantu solve problem.
                Klik "Chat Baru" untuk mulai!
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#12121a] border border-[#27273a] rounded-xl p-4 text-left hover:border-indigo-500/30 transition-colors">
                  <Code2 className="w-5 h-5 text-indigo-400 mb-2" />
                  <h3 className="text-sm font-medium text-white mb-1">Coding</h3>
                  <p className="text-xs text-gray-500">Bikin kode JS, Python, PHP, React, dll</p>
                </div>
                <div className="bg-[#12121a] border border-[#27273a] rounded-xl p-4 text-left hover:border-emerald-500/30 transition-colors">
                  <MessageCircle className="w-5 h-5 text-emerald-400 mb-2" />
                  <h3 className="text-sm font-medium text-white mb-1">Chat</h3>
                  <p className="text-xs text-gray-500">Ngobrol santai, diskusi, tanya jawab</p>
                </div>
                <div className="bg-[#12121a] border border-[#27273a] rounded-xl p-4 text-left hover:border-amber-500/30 transition-colors">
                  <Zap className="w-5 h-5 text-amber-400 mb-2" />
                  <h3 className="text-sm font-medium text-white mb-1">Fast</h3>
                  <p className="text-xs text-gray-500">Response cepat pakai Groq API</p>
                </div>
                <div className="bg-[#12121a] border border-[#27273a] rounded-xl p-4 text-left hover:border-pink-500/30 transition-colors">
                  <Shield className="w-5 h-5 text-pink-400 mb-2" />
                  <h3 className="text-sm font-medium text-white mb-1">Secure</h3>
                  <p className="text-xs text-gray-500">API key aman di server-side</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Cpu className="w-3.5 h-3.5" />
                <span>Powered by Groq AI - Llama 3.3 70B</span>
              </div>
            </div>
          </div>
        )}

        {hasActiveChat && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {activeMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
