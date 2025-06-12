import express from "express";
import { Request,Response } from "express";
import chatWithGemini from "../llms/gemini";
import chatWithMistral from "../llms/mistral";
import fetchSingleThread from "../utils/db_fetch";
const router= express.Router()

router.post('/',async(req:Request,res:Response)=>{

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
})

router.get('/:id',fetchSingleThread);

export default router