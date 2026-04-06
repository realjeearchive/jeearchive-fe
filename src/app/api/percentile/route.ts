import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Add spoofed browser headers to bypass bot-protection
    const res = await fetch("https://predictor-backend-vp3r.onrender.com/api/predict/percentile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: JSON.stringify(body),
    });

    // 2. If it fails, read the raw text so we can see the exact error in the terminal
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`🚨 External API Error (${res.status}):`, errorText);
      throw new Error(`Failed to fetch from external API: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("🚨 Percentile Proxy Caught Error:", error);
    return NextResponse.json(
      { error: "Prediction unavailable right now." },
      { status: 500 }
    );
  }
}