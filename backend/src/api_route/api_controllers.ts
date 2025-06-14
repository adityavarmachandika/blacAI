import { Request,Response } from "express"
import { db } from "../db";
import { apiConfigs } from "../db/schema"
import { v4 as uuidv4 } from 'uuid';
import { eq } from "drizzle-orm";


interface messageInstance{
    id: string,
    provider: string,
    apiKey: string,
    model: string,
    createdAt: Date,
    user_id: string,
}


const get_keys = async (req: Request, res: Response) => {
    const apiKeyData:messageInstance = {
    id: uuidv4(),
    provider: req.body.provider,
    apiKey: req.body.apiKey,
    model: req.body.model,
    createdAt: new Date(),
    user_id: req.body.user_id, // Assuming user_id is passed in the request body
};

    const isEntered=await db.insert(apiConfigs).values(apiKeyData);
    res.status(200).json({status:"success"})
}


const display_apis =async (req: Request, res: Response) => {
    const userId = req.params.user_id; // Assuming user_id is passed as a URL parameter
    const apiKeys = await db.select({model:apiConfigs.model,provider:apiConfigs.provider})
    .from(apiConfigs).where(eq(apiConfigs.user_id, userId));
    
    if (apiKeys.length > 0) {
        res.status(200).json(apiKeys);
    } else {
        res.status(404).json({ message: "No API keys found for this user." });
    }
}
export { get_keys, display_apis };