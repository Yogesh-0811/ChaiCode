import 'dotenv/config';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import fs from "fs";
import path from "path";

async function init(){
    const pdfFilePath = path.resolve("./rag/DBMS_Notes .pdf");
    const loader = new PDFLoader(pdfFilePath);

    //Page by page load the pdf file
    const docs = await loader.load();

    //Ready the client OPENAI Embedding Model
    const embeddings = new OpenAIEmbeddings({
        // apiKey: "YOUR-API-KEY", // In Node.js defaults to process.env.OPENAI_API_KEY
        // batchSize: 512, // Default value if omitted is 512. Max is 2048
        model: "text-embedding-3-large",
    });

    const vectorStore = await QdrantVectorStore.fromDocuments(
        docs, embeddings, {
            url: 'http://localhost:6333',
            collectionName: 'chaicode-collection',
        }
    );
    console.log("Indexing of documents done");
}

init();
