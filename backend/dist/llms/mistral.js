"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const chatWithMistral = async (req, res) => {
    const promptData = req.body;
    try {
        const response = await axios_1.default.post('https://api.mistral.ai/v1/chat/completions', {
            model: 'mistral-small',
            stream: true,
            messages: [{ role: 'user', content: promptData.prompt }],
        }, {
            responseType: 'stream',
            headers: {
                Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        //parsing the response json
        let buffer = '';
        response.data.on('data', (chunk) => {
            buffer += chunk.toString();
            let lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last line in buffer for next chunk
            for (const line of lines) {
                if (!line.startsWith('data: '))
                    continue; // Skip lines that don't start with 'data:'
                const jsonStr = line.replace('data: ', '').trim();
                if (jsonStr === '[DONE]') {
                    res.write("event: done\n\n");
                    res.end();
                    return;
                }
                try {
                    const parsed = JSON.parse(jsonStr);
                    const prompt = parsed?.choices?.[0]?.delta?.content;
                    if (prompt) {
                        const payload = { role: 'assistant', prompt };
                        res.write(`data: ${JSON.stringify(payload)}\n\n`);
                    }
                }
                catch (err) {
                    console.error('Parse error:', err);
                }
            }
        });
        response.data.on('end', () => {
            res.write("event: done\n\n");
            res.end();
        });
        response.data.on('error', (err) => {
            console.error('Stream error:', err);
            res.end();
        });
    }
    catch (error) {
        console.error('Request error:', error);
        res.status(500).end();
    }
};
exports.default = chatWithMistral;
