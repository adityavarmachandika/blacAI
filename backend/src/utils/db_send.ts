import { v4 as uuidv4} from "uuid";
import { db } from "../db";
import { messages,threads } from "../db/schema";

const storeToDatabase=async (thread_id:string,content:string,model:string)=>{
    let threadId=thread_id
    if(thread_id==null){
        threadId = uuidv4(); // Generate a new thread ID if not provided
        const threadDetails={
            id:threadId,
            title: content.slice(0, 20), // Use first 20 characters as title
            createdAt: new Date(),
            updatedAt: new Date(),
            systemPrompt: null,
            isArchived: false,
        }
        await db.insert(threads).values(threadDetails);
    }

    const messageDetails = {
        id: uuidv4(),
        role: 'user',
        content: content,
        isStreaming: true,
        tokens: 0, // Placeholder, you can calculate tokens if needed
        timestamp: new Date(),
        model: model,
        threadId: threadId,
    };

    await db.insert(messages).values(messageDetails)
        .then(() => {
            console.log("Message stored successfully");
        })
        .catch((error) => {
            console.error("Error storing message:", error);
        });
}

export default storeToDatabase;