import { Express, Request, Response } from "express";
import dotenv from 'dotenv';
import axios from "axios";
import storeToDatabase from "../utils/db_send";
dotenv.config();
type ChatMessage = {
  threadId: string;
  role: 'user' | 'assistant' | 'system';
  prompt: string;
  userId:string
};

const chatWithMistral = async (req: Request, res: Response) => {

  
  const promptData: ChatMessage = req.body;

  if(promptData.userId=== undefined)
  res.json({error: 'User ID is required'});
  try{
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small',
        stream: true,
        messages: [{ role: 'user', content: promptData.prompt }],
      },
      {
        responseType: 'stream',
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    //parsing the response json
    
    let totalOutput='';
    let buffer:string='';
    response.data.on('data', (chunk: Buffer) => {

      buffer+=chunk.toString();

      let lines =buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last line in buffer for next chunk

      

      for (const line of lines) {
        if(!line.startsWith('data: ')) continue; // Skip lines that don't start with 'data:'
        const jsonStr = line.replace('data: ', '').trim();
        if (jsonStr === '[DONE]') {
          res.write("event: done\n\n");
          res.end();
          return;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const output = parsed?.choices?.[0]?.delta?.content;
          if (output) {
            const payload = { role: 'assistant', output };
            totalOutput += output;
            res.write(`data: ${JSON.stringify(payload)}\n\n`);
          }
        } catch (err) {
          console.error('Parse error:', err);
        }
      }
    });

    response.data.on('end', async() => {
      res.write("event: done\n\n");
      const promptThread=await storeToDatabase(promptData.threadId, promptData.prompt, 'mistral-small','user',promptData.userId)
      storeToDatabase(promptThread, totalOutput, 'mistral-small','assistant',promptData.userId);
      res.end();
    });

    response.data.on('error', (err: any) => {
      console.error('Stream error:', err);
      res.end();
    });   
  }
  catch (error) {
    console.error('Request error:', error);
    res.status(500).end();
  }
}

export default chatWithMistral