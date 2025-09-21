import dotenv from 'dotenv';
dotenv.config();

let GoogleGenAI: any = null;
try { GoogleGenAI = require('@google/genai').GoogleGenAI; } catch(e){ console.warn('@google/genai not installed'); }

let aiplatform: any = null;
try { aiplatform = require('@google-cloud/aiplatform'); } catch(e){ console.warn('@google-cloud/aiplatform not installed'); }

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT || '';
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const GENAI_MODEL = process.env.VERTEX_MODEL_TEXT || 'gemini-2.5-flash';
const EMBEDDING_MODEL = process.env.VERTEX_EMBEDDING_MODEL || 'gemini-embedding-001';

function initGenAI(){ if(!GoogleGenAI) return null; return new GoogleGenAI({ vertexai:true, project:PROJECT, location:LOCATION }); }

export async function generateText(prompt: string, systemPrompt = ''): Promise<string> {
  const ai = initGenAI();
  if(!ai) throw new Error('GenAI SDK not available');
  const contents = `${systemPrompt}\n\n${prompt}`;
  const resp = await ai.models.generateContent({ model: GENAI_MODEL, contents });
  if (typeof resp.text === 'function') return resp.text();
  return resp?.text || JSON.stringify(resp);
}

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  if(!aiplatform){ return texts.map(()=> new Array(768).fill(0)); }
  const client = new aiplatform.v1.PredictionServiceClient({ apiEndpoint: `${LOCATION}-aiplatform.googleapis.com` });
  const endpoint = `projects/${PROJECT}/locations/${LOCATION}/publishers/google/models/${EMBEDDING_MODEL}`;
  const helpers = aiplatform.v1.helpers;
  const allEmbeddings: number[][] = [];
  for(const txt of texts){
    const instance = helpers.toValue({ content: txt, task_type: 'QUESTION_ANSWERING' });
    const request = { endpoint, instances: [instance], parameters: helpers.toValue({}) };
    const [response] = await client.predict(request);
    const preds = response.predictions || [];
    if(preds.length>0){
      const p = preds[0];
      const embeddingsProto = (p as any).structValue.fields.embeddings;
      const valuesProto = embeddingsProto.structValue.fields.values;
      const arr = valuesProto.listValue.values.map((v:any)=>v.numberValue);
      allEmbeddings.push(arr);
    } else { allEmbeddings.push(new Array(768).fill(0)); }
  }
  return allEmbeddings;
}

export async function explainClauseStructured(clauseText: string){
  const system = `You are a plain-language legal assistant. Input: a single contract clause. Reply ONLY with a JSON object with keys:\nlabel, oneLiner, eli5, risk, suggested_redline`;
  const prompt = `Clause:\n"""${clauseText}"""`;
  const raw = await generateText(prompt, system);
  try{
    const start = raw.indexOf('{');
    const jsonStr = start>=0? raw.slice(start) : raw;
    return JSON.parse(jsonStr);
  }catch(e){
    return { label:'General', oneLiner: clauseText.split('.').slice(0,1)[0], eli5: clauseText.split('.').slice(0,1)[0], risk:'Low', suggested_redline:'' };
  }
}
