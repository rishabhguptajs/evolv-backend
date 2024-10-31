import { Request, Response } from 'express';
import User from '../models/userSchema';

export const signupController = async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        let user = await User.findOne({ "personal_info.email": email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User({
            personal_info: {
                first_name,
                last_name,
                email,
                password,
            },
        });

        await user.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ "personal_info.email": email });

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        if (user.personal_info.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "User logged in successfully" });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};