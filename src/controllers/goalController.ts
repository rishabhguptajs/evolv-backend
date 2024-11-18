import Goal from "../models/goalSchema";
import { Request, Response } from "express";

export const createGoal = async(req: Request, res: Response) => {
    try {
        const { id: userId } = req.params;

        const { title, description, category, startDate, targetDate } = req.body;

        if(!title){
            return res.status(400).json({
                message: "Title is required",
            });
        }

        if(!category){
            return res.status(400).json({
                message: "Category is required",
            });
        }

        const newGoal = new Goal({
            userId,
            title,
            description,
            category,
            startDate,
            targetDate,
        });

        await newGoal.save();

        return res.status(201).json({
            message: "Goal created successfully",
            newGoal,
        });
    } catch (error: any) {
        res.status(500).json(error.message);
        console.log(error);
    }
}

export const getGoals = async(req: Request, res: Response) => {
    try {
        const { id: userId } = req.params;

        if(!userId){
            return res.status(400).json({
                message: "User ID is required",
            });
        }

        const goals = await Goal.find({ userId });

        if(!goals){
            return res.status(404).json({
                message: "No goals found",
            });
        }

        return res.status(200).json({
            goals,
            message: "Goals fetched successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
        });
        console.log(error);
    }
}

export const updateGoal = async(req: Request, res: Response) => {
    try {
        const { id: goalId } = req.params;

        const { title, description, category, startDate, targetDate } = req.body;

        const goal = await Goal.findById(goalId);

        if(!goal){
            return res.status(404).json({
                message: "Goal not found",
            });
        }

        const updatedGoal = await Goal.findByIdAndUpdate(goalId, {
            title: title || goal.title,
            description: description || goal.description,
            category: category || goal.category,
            startDate: startDate || goal.startDate,
            targetDate: targetDate || goal.targetDate,
        })

        return res.status(200).json({
            message: "Goal updated successfully",
            goal: updatedGoal,
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
        });
        console.log(error);
    }
}

export const deleteGoal = async(req: Request, res: Response) => {
    try {
        const { id: goalId } = req.params;

        const goal = await Goal.findById(goalId);

        if(!goal){
            return res.status(404).json({
                message: "Goal not found",
            });
        }

        await Goal.findByIdAndDelete(goalId);

        return res.status(200).json({
            message: "Goal deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
        });
        console.log(error);
    }
}