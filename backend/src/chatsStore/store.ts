import express from "express";
import { Request,Response } from "express";
import chatWithGemini from "../llms/gemini";
import chatWithMistral from "../llms/mistral";

const router= express.Router()

router.post('/',(req:Request,res:Response)=>{

    const {model}=req.body;

    switch(model.toLowerCase()){
        case 'gemini 2.0 flash':
            chatWithGemini(req,res)
        case 'mistral':
            chatWithMistral(req,res)
    }
})


export default router