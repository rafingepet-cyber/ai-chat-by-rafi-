"use client";

import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="bg-[#1e1e2e] border border-[#27273a] rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5 h-5">
          <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
          <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
          <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}
