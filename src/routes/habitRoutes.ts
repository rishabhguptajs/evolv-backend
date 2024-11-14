import express, { Request, Response } from "express"
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  markHabitAsDoneForDay,
  undoCompletedHabitForDay,
  getStreakForHabit,
  getWeeklyHabitSummary,
  getMonthlyHabitSummary
} from "../controllers/habitController"
import ensureAuthenticated from "../middlewares/ensureAuthenticated"

const router = express.Router()

router.get("/", ensureAuthenticated, async (req: Request, res: Response) => {
  await getHabits(req, res)
})

router.post("/", ensureAuthenticated, async (req: Request, res: Response) => {
  await createHabit(req, res)
})

router.put("/:id", ensureAuthenticated, async (req: Request, res: Response) => {
  await updateHabit(req, res)
})

router.delete("/:id", ensureAuthenticated, async (req: Request, res: Response) => {
  await deleteHabit(req, res)
})

router.post("/:id/mark-as-done", ensureAuthenticated, async (req: Request, res: Response) => {
  await markHabitAsDoneForDay(req, res)
})

router.post("/:id/undo-completed", ensureAuthenticated, async (req: Request, res: Response) => {
  await undoCompletedHabitForDay(req, res)
})

router.get("/:id/streak", ensureAuthenticated, async (req: Request, res: Response) => {
  await getStreakForHabit(req, res)
})

router.get("/:id/weekly-summary", ensureAuthenticated, async (req: Request, res: Response) => {
  await getWeeklyHabitSummary(req, res)
})

router.get("/:id/monthly-summary", ensureAuthenticated, async (req: Request, res: Response) => {
  await getMonthlyHabitSummary(req, res)
})

export default router
