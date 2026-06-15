import { NextResponse } from 'next/server';
export const runtime = "edge";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { examType, score, category, year } = body;

    let url = "";
    let payload = {};

    // Dynamically switch endpoints and payloads based on the exam type
    if (examType === "ADVANCED") {
      url = "https://my.newtonschool.co/rank-predictor/api/predict-jee-advanced-rank/";
      payload = { 
        category: category || "General", 
        jee_advanced_score: score 
      };
    } else {
      url = "https://my.newtonschool.co/rank-predictor/api/predict-jee-main-marks-percentile/";
      payload = { 
        jee_main_score: score, 
        year: year || 2025, 
        category: category || "General" 
      };
    }

    // Add spoofed browser headers to bypass bot-protection
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`🚨 External API Error (${res.status}):`, errorText);
      throw new Error(`Failed to fetch from external API: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("🚨 Prediction Proxy Caught Error:", error);
    return NextResponse.json(
      { error: "Prediction unavailable right now." },
      { status: 500 }
    );
  }
}