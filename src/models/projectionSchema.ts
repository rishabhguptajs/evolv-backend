import { Schema, model } from 'mongoose';

const projectionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    habit_id: {
        type: Schema.Types.ObjectId,
        ref: 'Habit',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    target_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['completed', 'incomplete', 'in_progress'],
        default: 'in_progress',
    },
    projection_data: {
        forecasted_completion_date: {
            type: Date,
        },
        success_probability: {
            type: Number,
        },
    }
}, { timestamps: true });

const Projection = model('Projection', projectionSchema);

export default Projection;