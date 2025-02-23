import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import objectRoute from './routes/objects.js'
import indicationRoute from './routes/indications.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

app.use(cors()) // запросы с разных ip-адресов
app.use(express.json())

app.use('/api/objects', objectRoute)
app.use('/api/indications', indicationRoute)

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.ptcur.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
    )
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
