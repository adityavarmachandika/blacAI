
import { Request, Response } from 'express';
import { db } from '../db';
import { messages, threads } from '../db/schema';
import { eq, desc, is } from 'drizzle-orm';
const fetchSingleThread = async (req: Request, res: Response):Promise<void> => {  

    const thread_id =req.params.thread_id;
    const latestMessages = await db
    .select({role:messages.role,
        content:messages.content,
        model:messages.model})
    .from(messages)
    .where(eq(messages.threadId, thread_id))
    .orderBy(desc(messages.timestamp))
    .limit(30);

    res.status(200).json(latestMessages)
}

const fetchAllThreads = async (req: Request, res: Response):Promise<void> => {
    const allThreads = await db
    .select({id:threads.id,
       title:threads.title,
       createdAt:threads.createdAt,
       isArchived:threads.isArchived,})
    .from(threads)
    .where(eq(threads.userId,req.params.user_id))
    .orderBy(desc(threads.updatedAt))

    res.status(200).json(allThreads)
}
export  {fetchSingleThread, fetchAllThreads};