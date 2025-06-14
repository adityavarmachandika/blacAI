import express from 'express'
import cors from 'cors'
import { Request } from 'express'
import api_router from './api_route/api_index'
import chat_router from './chat_route/store'

const app= express()

app.use(cors())
app.use(express.json())


app.use('/apikeys',api_router)
app.use('/chat', chat_router )

app.listen('3030',(error)=>{
    console.log("working on 3030",error)
})
