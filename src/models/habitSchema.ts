import { Schema, model } from 'mongoose';

const habitSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    frequency: {
        type: String,
        required: true,
        enum: ['daily', 'weekly', 'monthly'],
    },
    target: {
        type: Number,
        required: true,
    },
    progress: [{
        date: {
            type: Date,
            required: true,
        },
        completed: {
            type: Boolean,
            required: true,
        },
    }],
    streak: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Habit = model('Habit', habitSchema);

export default Habit;