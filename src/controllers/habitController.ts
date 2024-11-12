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

        if(!name){
            return res.status(400).json({ message: "Name is required" });
        }

        if(!description){
            return res.status(400).json({ message: "Description is required" });
        }

        if(!frequency){
            return res.status(400).json({ message: "Frequency is required" });
        }

        if(!target){
            return res.status(400).json({ message: "Target is required" });
        }

        const habit = {
            user_id: userID,
            name,
            description,
            frequency,
            target,
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

        return res.status(200).json({ habits, message: "Habits fetched successfully" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching habits", error: error instanceof Error ? error.message : error });
    }
}