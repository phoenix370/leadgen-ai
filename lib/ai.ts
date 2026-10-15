import OpenAI from 'openai';

export function getAIConfig() {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const qwenKey = process.env.QWEN_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  console.log('--- AI ROUTER DEBUG ---');
  console.log('Valid Gemini Key:', !!geminiKey && !geminiKey.includes('your-'));
  console.log('Valid Qwen Key:', !!qwenKey && !qwenKey.includes('your-'));
  console.log('Valid OpenAI Key:', !!openaiKey && !openaiKey.includes('your-'));

  // Priority 1: Google Gemini (Fast, free tier, highly reliable)
  if (geminiKey && !geminiKey.includes('your-')) {
    console.log('✅ Initializing Google Gemini Client');
    return {
      client: new OpenAI({
        apiKey: geminiKey,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/', // Google's OpenAI-compatible endpoint
      }),
      model: 'gemini-1.5-flash', // Fast and excellent for copywriting
    };
  }

  // Priority 2: Qwen (Great alternative if others are blocked)
  if (qwenKey && !qwenKey.includes('your-')) {
    console.log('✅ Initializing Qwen Client');
    return {
      client: new OpenAI({
        apiKey: qwenKey,
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      }),
      model: 'qwen-plus', 
    };
  }

  // Priority 3: OpenAI
  if (openaiKey && !openaiKey.includes('your-')) {
    console.log('✅ Initializing OpenAI Client');
    return {
      client: new OpenAI({ 
        apiKey: openaiKey,
        baseURL: 'https://api.openai.com/v1'
      }),
      model: 'gpt-4o',
    };
  }

  throw new Error('No valid AI API key found. Please add GEMINI_API_KEY, QWEN_API_KEY, or OPENAI_API_KEY to .env.local (without the word "your-").');
}