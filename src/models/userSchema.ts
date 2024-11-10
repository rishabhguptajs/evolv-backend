import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserInterface } from '../interfaces/userInterface';

const userSchema = new Schema<UserInterface>({
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
        },
    },
    oauth_info: [{
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        provider: {
            type: String,
            enum: ['google', 'facebook', 'github'],
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
        type: Buffer,
        default: Buffer.from('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'),
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
        default: Date.now,
    },
    behavior_tracking: {
        last_activity: {
            type: Date,
            default: Date.now,
        },
        activity_log: [{
            action: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
            metadata: {
                type: Schema.Types.Mixed,
            }
        }],
        session_duration: {
            type: Number,
        },
        total_time_spent: {
            type: Number,
        },
        device_info: {
            type: String,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
            },
        }
    },
    user_role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }
}, { timestamps: true });

userSchema.index({ location: '2dsphere' }, { sparse: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('personal_info.password')) {
        const salt = await bcrypt.genSalt(10);
        if (typeof this.personal_info.password === 'string') {
            this.personal_info.password = await bcrypt.hash(this.personal_info.password, salt);
        }
    }
    next();
});

const User = model<UserInterface>('User', userSchema);

export default User;
