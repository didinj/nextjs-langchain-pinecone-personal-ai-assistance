import { OpenAIEmbeddings } from '@langchain/openai';
import { getPineconeIndex } from '@/lib/pinecone/index';
import { PineconeStore } from '@langchain/pinecone';

export const embedDocuments = async (texts: string[], namespace = 'default') => {
    const index = await getPineconeIndex();

    const vectorStore = await PineconeStore.fromTexts(
        texts,
        texts.map(() => ({})), // metadata (optional)
        new OpenAIEmbeddings(),
        {
            pineconeIndex: index,
            namespace,
        }
    );

    return vectorStore;
};