import axios from 'axios';
import { Request,Response } from 'express';
import { Error } from 'postgres';
import storeToDatabase from '../utils/db_send';
type ChatMessage = {
  threadId: string;
  role: 'user' | 'assistant' | 'system';
  prompt: string;
};

async function chatWithGemini(req:Request, res:Response) {


  const {role,prompt,thread_id}=req.body
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

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

  geminiRes.data.on('end', () => {
    res.write("event: done by gemini\n\n");
    storeToDatabase(thread_id, prompt, 'mistral-small','user')
    storeToDatabase(thread_id, totalOutput, 'mistral-small','assistant');
    res.end();
  });

  geminiRes.data.on('error', (err:Error) => {
    console.error('Error from Gemini:', err);
    res.end();
  });
}

export default chatWithGemini

