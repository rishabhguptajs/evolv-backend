import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
    description: {
        type: String
    },
    criteria: {
        type: String,
        required: true
    },
    icon: {
        type: String
    }
})

const userBadgeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    badgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
        required: true
    },
    earnedAt: {
        type: Date,
        default: Date.now
    }
})

const Badge = mongoose.model('Badge', badgeSchema);
const UserBadge = mongoose.model('UserBadge', userBadgeSchema);

const badges = [
    {
        name: "Goal Getter",
        description: "Completed 5 goals",
        criteria: "5_goals"
    },
    {
        name: "Consistency King", 
        description: "Maintain a streak of 30 days",
        criteria: "30_day_streak"
    },
    {
        name: "Habit Master",
        description: "Created and maintained 10 habits",
        criteria: "10_habits"
    },
    {
        name: "Early Bird",
        description: "Complete 10 tasks before 9am",
        criteria: "early_tasks"
    },
    {
        name: "Milestone Maker",
        description: "Reached 50% progress on 3 goals",
        criteria: "goal_progress"
    },
    {
        name: "Perfect Week",
        description: "Complete all habits for 7 days straight",
        criteria: "perfect_week"
    },
    {
        name: "Goal Champion",
        description: "Completed 20 goals",
        criteria: "20_goals"
    },
    {
        name: "Habit Hero",
        description: "Maintain 5 habits simultaneously for 2 weeks",
        criteria: "habit_master"
    },
    {
        name: "Dedication Diamond",
        description: "Maintain a streak of 100 days",
        criteria: "100_day_streak"
    },
    {
        name: "Category Conqueror",
        description: "Complete goals in all categories",
        criteria: "all_categories"
    },
    {
        name: "Super Achiever",
        description: "Complete 3 goals before their target dates",
        criteria: "early_completion"
    },
    {
        name: "Productivity Pro",
        description: "Log in for 30 consecutive days",
        criteria: "login_streak"
    }
]

Badge.insertMany(badges)

export { Badge, UserBadge };