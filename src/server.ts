import express, { Application, Request, Response } from "express"
import dotenv from "dotenv"
import connectDB from "./config/db"
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import habitRoutes from "./routes/habitRoutes"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import {
  dailyHabitReminder,
  weeklyHabitReminder,
  monthlyHabitReminder,
} from "./crons/habitReminder"

const app: Application = express()

dotenv.config()

connectDB()
dailyHabitReminder.start()
weeklyHabitReminder.start()
monthlyHabitReminder.start()

app.use(express.json())
app.use(morgan("dev"))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
})

app.use(limiter)

app.get("/", (req: Request, res: Response) => {
  res.send("Evolv API is running...")
})

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/habits", habitRoutes)

const port = process.env.PORT || 8080 || 5000 || 5173 || 10000 || 3100

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
