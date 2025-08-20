import 'dotenv/config';
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OPENAI from 'openai'

const client = new OPENAI()

async function chat(){
    const userQuery='Can you tell me about decomposition properties in dbms. Also explan its types';

    const embeddings = new OpenAIEmbeddings({
        // apiKey: "YOUR-API-KEY", // In Node.js defaults to process.env.OPENAI_API_KEY
        // batchSize: 512, // Default value if omitted is 512. Max is 2048
        model: "text-embedding-3-large",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: 'http://localhost:6333',
            collectionName: 'chaicode-collection',
        }
    );

    const vectorSearcher = vectorStore.asRetriever({
        k: 3,
    });

    const relevantChunks = await vectorSearcher.invoke(userQuery);

    const SYSTEM_PROMPT = `
        You are an AI assistant who helps resolving user query based on the context available to you from a PDF file with the content and page number.

        Only answer based on the available context from file only.

        Context:
        ${JSON.stringify(relevantChunks)}
    `;

    const response = await client.chat.completions.create({
        model: 'gpt-4.1',
        messages: [
            {role: 'system', content: SYSTEM_PROMPT},
            {role: 'user', content: userQuery}
        ]
    });

    console.log(`> ${response.choices[0].message.content}`);
}
chat();