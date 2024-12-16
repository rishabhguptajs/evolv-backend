import express, { Application, Request, Response } from "express"
import dotenv from "dotenv"
import connectDB from "./config/db"
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import habitRoutes from "./routes/habitRoutes"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import passport from 'passport'
import session from 'express-session'
import './config/passport'
import {
  dailyHabitReminder,
  weeklyHabitReminder,
  monthlyHabitReminder,
} from "./crons/habitReminder"
import cookieParser from 'cookie-parser'

const app: Application = express()

dotenv.config()

connectDB()
dailyHabitReminder.start()
weeklyHabitReminder.start()
monthlyHabitReminder.start()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
})

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(limiter)

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.get("/", (req: Request, res: Response) => {
  res.send("Evolv API is running...")
})

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/habits", habitRoutes)

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
