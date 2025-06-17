import axios from 'axios';
import { Request,Response } from 'express';
import { Error } from 'postgres';
import {storeToDatabase} from '../chat_route/chat_controllers';
type ChatMessage = {
  threadId: string;
  role: 'user' | 'assistant' | 'system';
  prompt: string;
};

async function chatWithGemini(req:Request, res:Response) {


  const {role,prompt,thread_id,userId}=req.body

  const geminiRes = await axios({
    method: 'POST',
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`,
    data: {
      contents: [
        {
          role: role,
          parts: [{ text: prompt }]
        }
      ]
    },
    responseType: 'stream'
  });
  let totalOutput = '';
  geminiRes.data.on('data', (chunk:Buffer) => {
    const lines = chunk.toString().split('\n').filter(line => line.startsWith('data: '));
    for (const line of lines) {
      const json = line.replace('data: ', '');
      const parsed = JSON.parse(json);
      const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text;

      if (content) {
        totalOutput += content;
        res.write(`data: ${JSON.stringify({ role: 'assistant', content })}\n\n`);
      }
    }
  });

  geminiRes.data.on('end', async() => {
    res.write("event: done by gemini\n\n");
    const promptThread=await storeToDatabase(thread_id, prompt, "gemini 2.0 flash",'user', userId);
    if (promptThread) {
    await storeToDatabase(promptThread, totalOutput, "gemini 2.0 flash",'assistant', userId);
    }
    res.end();
  });

  geminiRes.data.on('error', (err:Error) => {
    console.error('Error from Gemini:', err);
    res.end();
  });
}

export default chatWithGemini

