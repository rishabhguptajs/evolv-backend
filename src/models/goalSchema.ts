import { Schema, model } from 'mongoose';

const goalSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        enum: ['personal', 'professional', 'fitness', 'other'],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    targetDate: {
        type: Date,
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    }
}, { timestamps: true });

const Goal = model('Goal', goalSchema);

export default Goal;