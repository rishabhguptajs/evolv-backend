import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    personal_info: {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        phone_number: {
            type: String,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        date_of_birth: {
            type: Date,
        },
        address: {
            type: String,
            required: true,
        },
    },
    oauth_info: [{
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        provider: {
            type: String,
            enum: ['google', 'facebook'],
        },
        provider_id: {
            type: String,
            required: true,
            unique: true,
        },
        access_token: {
            type: String,
            required: true,
        },
        refresh_token: {
            type: String,
        },
        expires_at: {
            type: Date,
        }
    }],
    profile_pic: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    preferences: {
        notification_pref: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            default: 'daily',
        },
        language_pref: {
            type: String,
            default: 'en',
        },
        theme_pref: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light',
        },
    },
    habits_info: [{
        habit_id: {
            type: Schema.Types.ObjectId,
            ref: 'Habit'
        },
        habit_name: {
            type: String,
            required: true,
        },
        habit_description: {
            type: String,
            required: true,
        }
    }],
    last_login: {
        type: Date,
    }
}, { timestamps: true });

const User = model('User', userSchema);

export default User;