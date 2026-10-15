import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface WebsiteData {
  headline: string;
  subheadline: string;
  about: string;
  services: string[];
}

// Helper function to pause execution (for retries)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const { name, category, address } = await request.json();
    
    const prompt = `Generate high-converting website copy for a local business. Return ONLY valid JSON with this exact structure:
    {
      "headline": "A catchy, bold main headline (max 8 words)",
      "subheadline": "A compelling subheadline explaining the value (max 15 words)",
      "about": "A short, friendly 'About Us' paragraph (2-3 sentences)",
      "services": ["Service 1", "Service 2", "Service 3"]
    }
    Business details: A ${category} named "${name}" located at ${address}.`;

    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    if (!geminiKey || geminiKey.includes('your-')) {
      throw new Error('Valid GEMINI_API_KEY not found in .env.local');
    }

    console.log('✅ Using Google Gemini (gemini-3.5-flash-lite) with Auto-Retry');
    const genAI = new GoogleGenerativeAI(geminiKey);
    
    // Use the most stable, widely available free-tier model
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" }); 

    let websiteData: WebsiteData | undefined;
    let lastError: unknown;

    // RETRY MECHANISM: Try up to 3 times if Google returns a 503 error
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/3 to generate content...`);
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Clean up markdown code blocks if Gemini adds them (e.g., ```json ... ```)
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        websiteData = JSON.parse(jsonStr);
        
        console.log('✅ Successfully generated website copy!');
        break; // Success! Exit the loop
        
      } catch (error: unknown) {
        lastError = error;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn(`⚠️ Attempt ${attempt} failed:`, errorMessage);
        
        // If it's a 503 (High Demand) or 429 (Rate Limit), wait and retry
        if (errorMessage.includes('503') || errorMessage.includes('429')) {
          if (attempt < 3) {
            console.log('⏳ Waiting 2 seconds before retrying...');
            await delay(2000); // Wait 2 seconds
            continue; // Go to next attempt
          }
        }
        
        // If it's a different error (like 400 Bad Request), throw immediately
        throw error;
      }
    }

    // If all 3 attempts failed, throw the last error
    if (!websiteData) {
      const finalErrorMsg = lastError instanceof Error ? lastError.message : String(lastError);
      throw new Error(`Gemini failed after 3 attempts: ${finalErrorMsg}`);
    }

    return NextResponse.json({ success: true, data: websiteData });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate website';
    console.error('❌ AI Generation Error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}