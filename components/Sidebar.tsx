"use client";

import { Plus, MessageSquare, Trash2, Sparkles } from "lucide-react";

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

export default function Sidebar({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  return (
    <div className="w-72 bg-[#0f0f1a] border-r border-[#27273a] flex flex-col h-full">
      <div className="p-4 border-b border-[#27273a]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">Rafi AI</h1>
            <p className="text-[10px] text-gray-500">AI Chat Assistant</p>
          </div>
        </div>
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Chat Baru
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider px-2 mb-2 mt-1">
          Riwayat Chat
        </p>
        {chats.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Belum ada chat</p>
            <p className="text-[10px] text-gray-600 mt-1">Mulai chat baru!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  activeChat === chat.id
                    ? "bg-indigo-600/20 border border-indigo-500/30"
                    : "hover:bg-[#1e1e2e] border border-transparent"
                }`}
              >
                <MessageSquare className={`w-4 h-4 flex-shrink-0 ${
                  activeChat === chat.id ? "text-indigo-400" : "text-gray-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${
                    activeChat === chat.id ? "text-indigo-300" : "text-gray-300"
                  }`}>
                    {chat.title}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {chat.timestamp.toLocaleDateString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[#27273a]">
        <p className="text-[10px] text-gray-600 text-center">
          Powered by Groq AI
        </p>
      </div>
    </div>
  );
}
