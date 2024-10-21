import { Schema, model } from 'mongoose';

const activityTypes = [
    'habit_created',
    'habit_completed',
    'habit_failed',
    'habit_deleted',
    'habit_updated',
    'habit_progress_updated',
    'goal_created',
    'goal_completed',
    'goal_failed',
    'goal_deleted',
    'goal_updated',
    'goal_progress_updated',
    'logged_out',
    'logged_in',
    'account_created',
]

const activityLogSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    activity_type: {
        type: String,
        enum: activityTypes,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const ActivityLog = model('ActivityLog', activityLogSchema);

export default ActivityLog;