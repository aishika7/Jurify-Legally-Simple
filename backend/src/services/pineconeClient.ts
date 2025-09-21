// import dotenv from 'dotenv';
// dotenv.config();
// let pinecone: any = null;
// try { pinecone = require('@pinecone-database/pinecone'); } catch (e) { console.warn('@pinecone not installed'); }
// const PINECONE_API_KEY = process.env.PINECONE_API_KEY || '';
// const PINECONE_ENV = process.env.PINECONE_ENV || '';
// const INDEX_NAME = process.env.PINECONE_INDEX || 'jurify-index';
// export function getPineconeClient() { if (!pinecone) return null; const client = new pinecone.PineconeClient(); client.init({ apiKey: PINECONE_API_KEY, environment: PINECONE_ENV }).catch((e: any) => console.error(e)); return client; }
// export { INDEX_NAME };

import { Pinecone } from '@pinecone-database/pinecone';

let pinecone: Pinecone | null = null;
export const INDEX_NAME = process.env.PINECONE_INDEX!;
export const getPineconeClient = () => {
  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENV) {
    throw new Error(
      `Missing Pinecone config: 
       PINECONE_API_KEY=${process.env.PINECONE_API_KEY ? "set" : "missing"}, 
       PINECONE_ENV=${process.env.PINECONE_ENV || "missing"}`
    );
  }

  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENV!,
    });
  }
  return pinecone;
};
