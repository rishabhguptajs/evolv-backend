import { PROJECTION_PROMPT } from './../utils/PROMPTS/projectionPrompt';
import Projection from "../models/projectionSchema";
import talkToLLM from "../utils/talkToLLM";
import { Request, Response } from "express";

export const createProjection = async(req: Request, res: Response) => {
    try {
        const { user_id, habit_id, name, target_date, status } = req.body;

        const projectionPrediction = await talkToLLM(
            process.env.OPENROUTER_API_URL as string,
            {
                "user_id": user_id,
                "habit_id": habit_id,
                "name": name,
                "target_date": target_date,
                "status": status
            },
            'POST',
            PROJECTION_PROMPT
        )

        const newProjection = new Projection({
            user_id,
            habit_id,
            name,
            target_date,
            status,
            projection_data: {
                forecasted_completion_date: projectionPrediction.forecasted_completion_date,
                success_probability: projectionPrediction.success_probability,
                details: projectionPrediction.details
            }
        });

        await newProjection.save();

        return res.status(201).json({ message: 'Projection created successfully!', projection: newProjection._id });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: 'Error in projection!', error: error.message });
    }
}