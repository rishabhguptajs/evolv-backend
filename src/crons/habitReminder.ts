import cron from 'node-cron';
import Habit from '../models/habitSchema';
import User from '../models/userSchema';
import sendEmail from '../utils/sendEmail';

export const dailyHabitReminder = cron.schedule('0 8 * * *', async () => {
    try {
        const habits = await Habit.find({ frequency: 'daily' });

        habits.forEach(async (habit) => {
            const user = await User.findById(habit.user_id);

            if (user) {
                await sendEmail(user.personal_info.email, 'Daily Habit Reminder', `Don't forget to ${habit.name} today!`);
            }
        });

        console.log(`Daily habit reminder sent to ${habits.length} users`);
    } catch (error: any) {
        console.error(error);
    }
});

export const weeklyHabitReminder = cron.schedule('0 8 * * 1', async () => {
    try {
        const habits = await Habit.find({ frequency: 'weekly' });

        habits.forEach(async (habit) => {
            const user = await User.findById(habit.user_id);

            if (user) {
                await sendEmail(user.personal_info.email, 'Weekly Habit Reminder', `Don't forget to ${habit.name} this week!`);
            }
        });

        console.log(`Weekly habit reminder sent to ${habits.length} users`);
    } catch (error: any) {
        console.error(error);
    }
});

export const monthlyHabitReminder = cron.schedule('0 8 1 * *', async () => {
    try {
        const habits = await Habit.find({ frequency: 'monthly' });

        habits.forEach(async (habit) => {
            const user = await User.findById(habit.user_id);

            if (user) {
                await sendEmail(user.personal_info.email, 'Monthly Habit Reminder', `Don't forget to ${habit.name} this month!`);
            }
        });

        console.log(`Monthly habit reminder sent to ${habits.length} users`);
    } catch (error: any) {
        console.error(error);
    }
});