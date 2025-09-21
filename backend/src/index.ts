import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload';
import summarizeRouter from './routes/summarize';
import explainRouter from './routes/explainClause';
import chatRouter from './routes/chat';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ dest: 'tmp/' });
app.use('/upload', upload.single('file'), uploadRouter);
app.use('/summarize', summarizeRouter);
app.use('/explain-clause', explainRouter);
app.use('/chat', chatRouter);

app.get('/', (_req, res) => res.send({ status: 'Jurify backend running' }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
