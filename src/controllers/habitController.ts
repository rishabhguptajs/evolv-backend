import Habit from "../models/habitSchema";
import User from "../models/userSchema";
import { Request, Response } from "express";

export const createHabit = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userID = req.params.id;

        if (!userID) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { name, description, frequency, target } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }

        if (!frequency) {
            return res.status(400).json({ message: "Frequency is required" });
        }

        if (!target) {
            return res.status(400).json({ message: "Target is required" });
        }

        const allowedFrequencies = ['daily', 'weekly', 'monthly'];

        if (!allowedFrequencies.includes(frequency)) {
            return res.status(400).json({ message: "Frequency must be one of the following: daily, weekly, monthly" });
        }

        const habit = {
            user_id: userID,
            name,
            description,
            frequency,
            target,
            progress: [{
                date: new Date(),
                completed: false,
            }],
            streak: 0,
        };

        const newHabit = new Habit(habit);

        await newHabit.save();

        const userHabit = {
            habit_id: newHabit._id.toString(),
            habit_name: name,
            habit_description: description
        }

        user.habits_info?.push(userHabit);

        await user.save();

        return res.status(201).json({ habit: newHabit, message: "Habit created successfully!" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Error creating habit", error: error instanceof Error ? error.message : error });
    }
};

export const getHabits = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userID = req.params.id;

        if (!userID) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const habits = await Habit.find({ user_id: userID });

        const enhancedHabits = habits.map(habit => {
            const totalProgress = habit.progress.length;
            const completedProgress = habit.progress.filter(p => p.completed).length;
            const progressRate = totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0;

            return {
                ...habit.toObject(),
                streak: habit.streak,
                progressRate: progressRate.toFixed(2)
            };
        });

        return res.status(200).json({ habits: enhancedHabits, message: "Habits fetched successfully" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching habits", error: error instanceof Error ? error.message : error });
    }
}

export const markHabitAsDoneForDay = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id: habitID } = req.params;
        const today = new Date().toISOString().slice(0, 10);

        if (!habitID) {
            return res.status(400).json({ message: "Habit ID is required" });
        }

        const habit = await Habit.findById(habitID);

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const todayProgress = habit.progress.find(entry => entry.date.toISOString().slice(0, 10) === today);
        if(todayProgress && todayProgress.completed) {
            return res.status(400).json({ message: "Habit already marked as done for today" });
        }

        habit.progress.push({
            date: new Date(),
            completed: true,
        });

        habit.streak = ( todayProgress && todayProgress.completed ) ? habit.streak + 1 : 1;

        await habit.save();

        return res.status(200).json({ habit, message: "Habit marked as done for today" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Error marking habit as done", error: error instanceof Error ? error.message : error });
    }
}

export const undoCompletedHabitForDay = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id: habitID } = req.params;

        if (!habitID) {
            return res.status(400).json({ message: "Habit ID is required" });
        }

        const habit = await Habit.findById(habitID);

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const today = new Date().toISOString().slice(0, 10);
        const todayProgress = habit.progress.find(entry => entry.date.toISOString().slice(0, 10) === today);

        if (!todayProgress) {
            return res.status(400).json({ message: "Habit not marked as done for today" });
        }

        if (!todayProgress.completed) {
            return res.status(400).json({ message: "Habit already marked as not done for today" });
        }

        const index = habit.progress.findIndex(entry => entry.date.toISOString().slice(0, 10) === today);
        habit.progress.splice(index, 1);

        habit.streak = habit.streak - 1;

        await habit.save();

        return res.status(200).json({ habit, message: "Habit undone for today" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Error undoing completed habit", error: error instanceof Error ? error.message : error });
        
    }
}

export const getStreakForHabit = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id: habitID } = req.params;

        if (!habitID) {
            return res.status(400).json({ message: "Habit ID is required" });
        }

        const habit = await Habit.findById(habitID);

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        return res.status(200).json({ streak: habit.streak, message: "Streak fetched successfully" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching streak for habit", error: error instanceof Error ? error.message : error });
    }
}

export const getWeeklyHabitSummary = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id: habitID } = req.params;

        if (!habitID) {
            return res.status(400).json({ message: "Habit ID is required" });
        }

        const habit = await Habit.findById(habitID);

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const lastWeekProgress = habit.progress.filter(entry => {
            const daysAgo = (new Date().getTime() - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24);
            return daysAgo <= 7;
        });

        return res.status(200).json({ progress: lastWeekProgress, message: "Weekly habit summary fetched successfully" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching weekly habit summary", error: error instanceof Error ? error.message : error });
    }
}

export const getMonthlyHabitSummary = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id: habitID } = req.params;

        if (!habitID) {
            return res.status(400).json({ message: "Habit ID is required" });
        }

        const habit = await Habit.findById(habitID);

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const lastMonthProgress = habit.progress.filter(entry => {
            const daysAgo = (new Date().getTime() - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24);
            return daysAgo <= 30;
        });

        return res.status(200).json({ progress: lastMonthProgress, message: "Monthly habit summary fetched successfully" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching monthly habit summary", error: error instanceof Error ? error.message : error });
    }
}