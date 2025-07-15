import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { embedDocuments } from '@/lib/langchain/embeddings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const filePath = path.join(process.cwd(), 'docs', 'example.txt');
        const content = await fs.readFile(filePath, 'utf-8');

        await embedDocuments([content]);

        res.status(200).json({ message: 'Document embedded successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Embedding failed.' });
    }
}