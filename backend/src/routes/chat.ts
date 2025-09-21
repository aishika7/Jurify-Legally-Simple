import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getEmbeddings, generateText } from '../services/vertexClient';
import { getPineconeClient, INDEX_NAME } from '../services/pineconeClient';
import { QueryRequest, UpsertRequest, Vector } from '@pinecone-database/pinecone';

dotenv.config();

const router = Router();
const pinecone = getPineconeClient();

async function upsertClauses(clauses: any[], namespace = 'default') {
  if (!pinecone) return;
  const index = pinecone.Index(INDEX_NAME);

  const texts = clauses.map(c => c.text);
  const vectors = await getEmbeddings(texts);

  // Correctly typed PineconeRecord array
  const records: Vector[] = clauses.map((c, i) => ({
    id: `${namespace}::${c.id}`,
    values: vectors[i],
    metadata: { clauseId: c.id, text: c.text },
  }));

  const upsertRequest: UpsertRequest = {
    vectors: records,
    namespace,
  };

  // await index.upsert({ vectors: records, namespace });
}

// Query Pinecone for relevant clauses
async function queryPinecone(query: string, topK = 5, namespace = 'default') {
  if (!pinecone) return [];
  const index = pinecone.Index(INDEX_NAME);
  const [emb] = await getEmbeddings([query]);

  const queryRequest: QueryRequest = {
    topK,
    vector: emb as number[],
    includeMetadata: true,
    namespace,
  };

  const resp = await index.query({
    vector: emb,
    topK,
    includeMetadata: true,
  });

  const matches = (resp.matches || []).map(m => ({
    id: m.id,
    score: m.score,
    text: m.metadata?.text,
    clauseId: m.metadata?.clauseId,
  }));

  return matches;
}

// Main chat endpoint
router.post('/', async (req: Request, res: Response) => {
  const { question, clauses, namespace = 'default' } = req.body;
  if (!question) return res.status(400).json({ error: 'Missing question' });

  try {
    if (pinecone && Array.isArray(clauses)) {
      await upsertClauses(clauses, namespace);
      const matches = await queryPinecone(question, 5, namespace);
      const context = matches.map(m => `Clause ${m.clauseId}: ${m.text}`).join('\n---\n');

      const prompt = `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer concisely and cite clause numbers.`;
      const answer = await generateText(prompt, 'You are an assistant that bases answers only on supplied clauses.');

      res.json({ answer, matches });
      return;
    }

    // Fallback: simple keyword search
    let hits: any[] = [];
    if (Array.isArray(clauses)) {
      const q0 = question.split(' ')[0].toLowerCase();
      hits = clauses.filter(c => c.text.toLowerCase().includes(q0)).slice(0, 5);
    }

    const answer = hits.length
      ? `Found ${hits.length} matching clause(s): "${hits[0].text.slice(0, 200)}..."`
      : 'No matches found (fallback).';

    res.json({ answer, hits });
  } catch (err: any) {
    res.status(500).json({ error: 'Chat failed', details: String(err) });
  }
});

// Stream endpoint for real-time responses
router.get('/stream', async (req: Request, res: Response) => {
  const question = String(req.query.question || '');
  const namespace = String(req.query.namespace || 'default');

  if (!question) return res.status(400).json({ error: 'Missing question' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    let matches: any[] = [];
    if (pinecone) matches = await queryPinecone(question, 5, namespace);

    const context = matches.map(m => `Clause ${m.clauseId}: ${m.text}`).join('\n---\n');
    const prompt = `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer concisely and cite clause numbers.`;

    const final = await generateText(prompt, 'You are a precise assistant; base answers only on the context.');

    const chunkSize = 120;
    for (let i = 0; i < final.length; i += chunkSize) {
      const chunk = final.slice(i, i + chunkSize);
      res.write(`data: ${chunk}\n\n`);
      await new Promise(r => setTimeout(r, 120));
    }

    res.write(`event: metadata\ndata: ${JSON.stringify({ matches })}\n\n`);
    res.write('event: done\ndata: {}\n\n');
    res.end();
  } catch (err: any) {
    res.write(`event: error\ndata: ${JSON.stringify({ message: String(err) })}\n\n`);
    res.end();
  }
});

export default router;
