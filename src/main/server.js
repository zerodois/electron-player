import express from 'express'
import { resolve } from 'path'
import { PORT } from '../share'

const app = express()

app.use(express.static(resolve('.', 'storage')))
app.listen(PORT, _ => console.log(`Server running in :${PORT}`))
