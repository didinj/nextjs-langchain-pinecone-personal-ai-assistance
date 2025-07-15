// pages/api/query.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRAGChain } from '@/lib/langchain/rag';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const chain = await createRAGChain();

        const response = await chain.invoke({ question });

        res.status(200).json({ answer: response.content });
    } catch (err) {
        console.error('RAG error:', err);
        res.status(500).json({ error: 'Failed to retrieve answer' });
    }
}
