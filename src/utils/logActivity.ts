import User from "../models/userSchema";

const logActivity = async(userID: string, action: string, metadata: any) => {
    const user = await User.findById(userID);

    if (!user) {
        throw new Error("User not found");
    }

    const activity = {
        action,
        timestamp: new Date(),
        metadata,
    };

    if (user.behavior_tracking) {
        if (!user.behavior_tracking.activity_log) {
            user.behavior_tracking.activity_log = [];
        }
        user.behavior_tracking.activity_log.push(activity);
        user.behavior_tracking.last_activity = new Date();
    }

    await user.save();
};

export default logActivity;