import axios from "axios";
import { db } from "./db/schama";
import type { Threads,Messages } from "./db/schama";
const baseUrl = "http://localhost:3030";

const api = axios.create({
    baseURL: baseUrl, 
});

const getAllThreads = async (userId:string) => {
        const response = await api.get(`/chat/get_threads/`+userId);
        const threadData: Threads[] = response.data;
        console.log("Response from getAllThreads:", threadData);
        const result=await db.threads.bulkPut(threadData)
        console.log("Data stored in IndexedDB:", result);
}

const individualThreads= async(thread_id:string)=>{
    const response=await api.get(`/chat/${thread_id}`);
    const threadData:Messages[]  = response.data;
    // console.log("Response from individualThreads:", threadData);

    const result=await db.messages.bulkPut(threadData)
    console.log("Data stored in IndexedDB:", result);
}

export  {getAllThreads, individualThreads};