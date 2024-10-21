import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['habit_reminder', 'goal_reminder', 'system_notification'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    sent_at: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['sent', 'failed', 'read'],
        default: 'sent',
    },
    read_at: {
        type: Date,
    },
}, { timestamps: true });

const Notification = model('Notification', notificationSchema);

export default Notification;