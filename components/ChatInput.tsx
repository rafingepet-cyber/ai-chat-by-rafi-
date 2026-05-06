"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="border-t border-[#27273a] bg-[#0a0a0f] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2 bg-[#12121a] border border-[#27273a] rounded-2xl p-2 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesanmu di sini... (Shift+Enter untuk baris baru)"
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 resize-none outline-none px-3 py-2 max-h-[200px] min-h-[40px]"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-all ${
              input.trim() && !isLoading
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20"
                : "bg-[#1e1e2e] text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-[10px] text-gray-600 text-center mt-2">
          Rafi AI bisa bikin kode, ngobrol, dan bantu solve problem. Tekan Enter untuk kirim.
        </p>
      </div>
    </div>
  );
}
