import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model = "llama-3.3-70b-versatile" } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: `Kamu adalah AI Chat Assistant bernama "Rafi AI". Kamu adalah asisten AI yang sangat pintar, ramah, dan profesional.

Kemampuan kamu:
1. **Ngobrol & Chat** - Bisa diajak ngobrol santai, diskusi, tanya jawab, curhat, dll.
2. **Coding & Programming** - Bisa bikin kode dalam berbagai bahasa pemrograman (JavaScript, Python, PHP, Java, C++, HTML/CSS, React, Next.js, dll). Kode yang dibuat harus clean, well-commented, dan production-ready.
3. **Problem Solving** - Bantu solve error, debug kode, jelaskan konsep programming.
4. **Creative** - Bantu ide, nulis konten, bikin script, dll.

Rules:
- Selalu jawab dalam Bahasa Indonesia kecuali user minta bahasa lain
- Untuk kode, selalu pakai markdown code block dengan bahasa yang sesuai
- Jelaskan kode dengan detail dan mudah dipahami
- Kalau ada error, jelaskan penyebab dan solusinya
- Selalu ramah dan helpful
- Jangan pernah kasih response kosong atau error tanpa penjelasan`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API error:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to get response from AI" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
