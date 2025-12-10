import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongoDb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhook.js'
import educatorRoute from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRoute from './routes/courseRoutes.js'
import userRouter from './routes/userRoutes.js'

const PORT = process.env.PORT || 5000
const app = express()

await connectDB()
await connectCloudinary()

app.use(cors())
app.use(clerkMiddleware())
app.get('/', (req, res) => res.send('hello'))

// ✔️ MUST match Clerk Dashboard webhook URL
app.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
)
app.use('/api/educator', express.json(), educatorRoute)
app.use('/api/course', express.json(), courseRoute)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

app.listen(PORT, () => {
  console.log(`server is listening from ${PORT}`)
})
