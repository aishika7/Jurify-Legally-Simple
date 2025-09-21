import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const file: any = (req as any).file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const ext = path.extname(file.originalname || '').toLowerCase();
    let data = '';
    if (ext === '.pdf') {
      try {
        const buffer = fs.readFileSync(file.path);
        const parsed = await pdf(buffer);
        data = parsed.text || '';
      } catch (e) {
        data = fs.readFileSync(file.path, 'utf-8');
      }
    } else {
      data = fs.readFileSync(file.path, 'utf-8');
    }

    const clauses = data.split(/\n\n|(?<=\.)\s+/).map((c: string, i: number) => ({ id: i+1, text: c.trim() })).filter((c: any)=>c.text.length>0);
    try { fs.unlinkSync(file.path); } catch(e) {}
    res.json({ text: data, clauses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read uploaded file.', details: String(err) });
  }
});

export default router;
