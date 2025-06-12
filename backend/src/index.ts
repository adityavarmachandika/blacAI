import express from 'express'
import cors from 'cors'
import { Request } from 'express'
import get_keys from './apikeys/user_api_keys'
import chat from './chatsStore/store'

const app= express()

app.use(cors())
app.use(express.json())


app.use('/chat', chat )

app.post('/apikeys',get_keys)




app.listen('3030',(error)=>{
    console.log("working on 3030",error)
})
