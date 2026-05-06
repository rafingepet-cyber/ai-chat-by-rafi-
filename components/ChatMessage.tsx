"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { User, Bot, Copy, Check, Download } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadCode = (code: string, language: string) => {
    const extensions: Record<string, string> = {
      javascript: "js", typescript: "ts", python: "py", java: "java",
      cpp: "cpp", c: "c", php: "php", html: "html", css: "css",
      json: "json", sql: "sql", bash: "sh", shell: "sh",
      markdown: "md", yaml: "yml", xml: "xml", rust: "rs",
      go: "go", kotlin: "kt", swift: "swift", dart: "dart",
    };
    
    const ext = extensions[language.toLowerCase()] || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fade-in`}>
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-purple-600"
            : "bg-gradient-to-br from-emerald-500 to-teal-600"
        }`}
      >
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>

      <div className={`flex-1 max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`relative group px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-sm"
              : "bg-[#1e1e2e] border border-[#27273a] text-[#e2e8f0] rounded-tl-sm"
          }`}
        >
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
              isUser ? "bg-white/10 hover:bg-white/20" : "bg-[#27273a] hover:bg-[#3f3f5a]"
            }`}
            title="Copy message"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>

          {isUser ? (
            <p className="text-sm leading-relaxed pr-8">{message.content}</p>
          ) : (
            <div className="markdown-content text-sm leading-relaxed pr-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\\w+)/.exec(className || "");
                    const language = match ? match[1] : "";
                    const codeString = String(children).replace(/\\n$/, "");

                    if (!inline && language) {
                      return (
                        <div className="relative my-3 group/code">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#0a0a0f] rounded-t-lg border-b border-[#27273a]">
                            <span className="text-xs text-gray-400 font-mono">{language}</span>
                            <button
                              onClick={() => handleDownloadCode(codeString, language)}
                              className="p-1 rounded hover:bg-[#27273a] transition-colors"
                              title="Download code"
                            >
                              <Download className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                          </div>
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={language}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: "0 0 0.75rem 0.75rem",
                              fontSize: "0.8rem",
                              lineHeight: "1.5",
                            }}
                            {...props}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <span className="text-[10px] text-gray-500 mt-1 px-1">
          {message.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
