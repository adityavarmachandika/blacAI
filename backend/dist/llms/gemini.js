"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function chatWithGemini(req, res) {
    const { role, prompt, thread_id } = req.body;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const geminiRes = await (0, axios_1.default)({
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
    geminiRes.data.on('data', (chunk) => {
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
        res.end();
    });
    geminiRes.data.on('error', (err) => {
        console.error('Error from Gemini:', err);
        res.end();
    });
}
exports.default = chatWithGemini;
