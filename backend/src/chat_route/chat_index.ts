import express from "express";
import {chatWithModels, fetchSingleThread,fetchAllThreads} from "./chat_controllers";

const router= express.Router()

router.post('/',chatWithModels)

router.get('/:thread_id', fetchSingleThread);

router.get('/get_threads/:userId',fetchAllThreads)
export default router