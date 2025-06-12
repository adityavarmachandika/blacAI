import { Request,Response } from "express"
import { db } from "../db";
import { apiConfigs } from "../db/schema"
import {  v4 as uuidv4 } from 'uuid';


interface messageInstance{
    id: string,
    provider: string,
    apiKey: string,
    model: string,
    isDefault: boolean,
    createdAt: Date,
}


const get_keys = async (req: Request, res: Response) => {
    const apiKeyData:messageInstance = {
    id: uuidv4(),
    provider: req.body.provider,
    apiKey: req.body.apiKey,
    model: req.body.model,
    isDefault: req.body.isDefault,
    createdAt: new Date(),
};

    const isEntered=await db.insert(apiConfigs).values(apiKeyData);
    console.log(isEntered)
}

export default get_keys