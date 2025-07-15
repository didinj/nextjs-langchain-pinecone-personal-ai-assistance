import { pinecone } from './client';

export const getPineconeIndex = async () => {
    return pinecone.Index(process.env.PINECONE_INDEX_NAME!);
};