import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableMap, RunnableSequence } from '@langchain/core/runnables';
import { getPineconeIndex } from '@/lib/pinecone/index';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';

export const createRAGChain = async () => {
    const index = await getPineconeIndex();

    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        {
            pineconeIndex: index,
            namespace: 'default',
        }
    );

    const retriever = vectorStore.asRetriever({ k: 4 });

    const prompt = PromptTemplate.fromTemplate(`
You are a helpful assistant. Use the following context to answer the question.
If you don't know the answer, just say "I don't know".

Context:
{context}

Question:
{question}
  `);

    const llm = new ChatOpenAI({
        modelName: 'gpt-4',
        temperature: 0.5,
    });

    const chain = RunnableSequence.from([
        RunnableMap.from({
            context: async (input: { question: string }) => {
                const docs = await retriever.invoke(input.question);
                return docs.map((doc) => doc.pageContent).join('\n\n');
            },
            question: (input: { question: string }) => input.question,
        }),
        prompt,
        llm,
    ]);

    return chain;
};
