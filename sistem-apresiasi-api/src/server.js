import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

import activityRouter from "./routes/activities.js"
import usersRouter from "./routes/users.js"
import authRouter from "./routes/authentications.js"
import skpiRouter from "./routes/skpi.js"
import achievementRouter from "./routes/achievements.js"
import exportsRouter from "./routes/exports.js"
import uploadRouter from "./routes/uploads.js"
import ttdRouter from "./routes/ttd.js"
import { errorHandler } from "./middleware/errorHandler.js"
import bodyParser from "body-parser"

const app = express()
const PORT = process.env.SERVER_PORT

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

// middleware
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, "../public")))
app.use(bodyParser.urlencoded({ extended: true }))

// api handler
app.use("/api/v1/activities", activityRouter)
app.use("/api/v1/users", usersRouter)
app.use("/api/v1/authentications", authRouter)
app.use("/api/v1/skpi", skpiRouter)
app.use("/api/v1/achievements", achievementRouter)
app.use("/api/v1/exports", exportsRouter)
app.use("/api/v1/uploads", uploadRouter)
app.use("/api/v1/ttd", ttdRouter)

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Running on localhost:${PORT}`)
})
