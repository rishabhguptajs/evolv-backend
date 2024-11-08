import jwt from "jsonwebtoken";
import User from "../models/userSchema";

const ensureAuthenticated = async (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.behavior_tracking) {
            user.behavior_tracking.last_activity = new Date();
        }

        await user.save();

        req.user = user;
        next();
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Error authenticating user", error: error instanceof Error ? error.message : error });
    }
};

export default ensureAuthenticated;