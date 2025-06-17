import { v4 as uuidv4} from "uuid";
import { Request, Response } from 'express';
import { db } from '../db';
import { messages, threads } from '../db/schema';
import { eq, desc, is } from 'drizzle-orm';
import chatWithGemini from '../llms/gemini';
import chatWithMistral from '../llms/mistral';

// messages: "message_id, role, content, isStreaming, timestamp, model, thread_id",

const fetchSingleThread = async (req: Request, res: Response):Promise<void> => {  
    const thread_id =req.params.thread_id;
    const latestMessages = await db
    .select({
        message_id:messages.id,
        role:messages.role,
        content:messages.content,
        isStreaming:messages.isStreaming,
        timestamp: messages.timestamp,
        model:messages.model,
        thread_idL: messages.thread_id,
    })
    .from(messages)
    .where(eq(messages.thread_id, thread_id))
    .orderBy(desc(messages.timestamp))
    .limit(30);

    res.status(200).json(latestMessages)
}

//      threads: "thread_id, title, updated_at, isArchived",
const fetchAllThreads = async (req: Request, res: Response):Promise<void> => {
    const allThreads = await db
    .select({thread_id:threads.id,
       title:threads.title,
       updated_at:threads.updatedAt,
       isArchived:threads.isArchived,})
    .from(threads)
    .where(eq(threads.userId,req.params.userId))
    .orderBy(desc(threads.updatedAt))

    res.status(200).json(allThreads)
}





const storeToDatabase=async (thread_id:string,content:string,model:string,user:string,userId:string)=>{
    let threadId=thread_id
    if(thread_id=='' || thread_id==null){
        threadId = uuidv4(); // Generate a new thread ID if not provided
        const threadDetails={
            id:threadId,
            title: content.slice(0, 20), // Use first 20 characters as title
            createdAt: new Date(),
            updatedAt: new Date(),
            systemPrompt: null,
            isArchived: false,
            userId: userId
        }
        await db.insert(threads).values(threadDetails);
    }
    
    const messageDetails = {
        id: uuidv4(),
        role: user,
        content: content,
        isStreaming: true,
        tokens: 0, // Placeholder, you can calculate tokens if needed
        timestamp: new Date(),
        model: model,
        thread_id: threadId,
    };

    await db.insert(messages).values(messageDetails)
        .then(() => {
            console.log("Message stored successfully");
        })
        .catch((error) => {
            console.error("Error storing message:", error);
        });
    return threadId; // Return the thread ID for further use
}

 

const chatWithModels= async(req:Request,res:Response)=>{

    const {model}=req.body;

    switch(model.toLowerCase()){
        case 'gemini 2.0 flash':
            await chatWithGemini(req,res)
            break;
        case 'mistral':
            await chatWithMistral(req,res)
            break;
        default:
            res.status(400).json({error: 'Unsupported model'});
    }
}

export  {fetchSingleThread, fetchAllThreads,storeToDatabase,chatWithModels};