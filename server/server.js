import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongoDb.js'
import { clerkWebhooks } from './controllers/webhook.js'

const PORT = process.env.PORT || 5000

const app = express()
await connectDB()

app.use(cors())

app.get('/', (req,res) => res.send('hello'))
app.post(
  "/clerk",
  express.raw({ type: "application/json" }), 
  clerkWebhooks
);

app.listen(PORT, ()=> {
    console.log(`server is listening from ${PORT}`)
})