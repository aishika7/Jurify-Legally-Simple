import { Router, Request, Response } from 'express';
import { generateText } from '../services/vertexClient';
const router = Router();
router.post('/', async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });
  try {
    const system = `You are a document summarizer. Output JSON: { title, bullets: [...], riskOverview }`;
    const prompt = `Document:\n"""${text.slice(0,15000)}"""`;
    const raw = await generateText(prompt, system);
    try { const start = raw.indexOf('{'); const jsonStr = start>=0?raw.slice(start):raw; const parsed = JSON.parse(jsonStr); res.json(parsed); } catch(e){ const bullets = text.split('.').slice(0,3).map((s:any)=>s.trim()).filter(Boolean); res.json({ title:text.split('\n')[0]||'Document Summary', bullets, riskOverview:'' }); }
  } catch(err:any){ res.status(500).json({ error:'Summarization failed', details:String(err) }); }
});
export default router;
