import { Router, Request, Response } from 'express';
import { explainClauseStructured } from '../services/vertexClient';
const router = Router();
router.post('/', async (req: Request, res: Response) => {
  const { clause } = req.body;
  if (!clause) return res.status(400).json({ error: 'Missing clause' });
  try { const explanation = await explainClauseStructured(clause); res.json(explanation); } catch(err:any){ res.status(500).json({ error:'Explain failed', details:String(err) }); }
});
export default router;
