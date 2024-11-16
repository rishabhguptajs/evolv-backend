import cron from 'node-cron';
import Habit from '../models/habitSchema';
import User from '../models/userSchema';
import sendEmail from '../utils/sendEmail';

const getStartOfDay = (date: Date): Date => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
};

const getStartOfWeek = (date: Date): Date => {
    const start = getStartOfDay(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return start;
};

const getStartOfMonth = (date: Date): Date => {
    const start = getStartOfDay(date);
    start.setDate(1);
    return start;
};

const sendReminder = async (habit: any, period: string): Promise<void> => {
    try {
        const user = await User.findById(habit.user_id);
        if (user?.personal_info?.email) {
            await sendEmail(
                user.personal_info.email,
                `${period} Habit Reminder`,
                `Don't forget to ${habit.name} ${period === 'Daily' ? 'today' : period === 'Weekly' ? 'this week' : 'this month'}!`
            );
        }
    } catch (error) {
        console.error(`Failed to send reminder for habit ${habit._id}:`, error);
    }
};

// Daily reminder cron job - 8:00 AM every day
export const dailyHabitReminder = cron.schedule('0 8 * * *', async () => {
    try {
        const habits = await Habit.find({ frequency: 'daily' });
        const today = getStartOfDay(new Date());

        for (const habit of habits) {
            const todayProgress = habit.progress.find(progress => 
                getStartOfDay(new Date(progress.date)).getTime() === today.getTime()
            );

            if (!todayProgress?.completed) {
                await sendReminder(habit, 'Daily');
            } else {
                console.log(`Habit "${habit.name}" already completed for today`);
            }
        }

        console.log(`Daily habit reminders processed for ${habits.length} habits`);
    } catch (error) {
        console.error('Error in daily habit reminder:', error);
    }
});

// Weekly reminder cron job - 8:00 AM every Monday
export const weeklyHabitReminder = cron.schedule('0 8 * * 1', async () => {
    try {
        const habits = await Habit.find({ frequency: 'weekly' });
        const startOfWeek = getStartOfWeek(new Date());

        for (const habit of habits) {
            const weeklyProgress = habit.progress.find(progress => 
                getStartOfDay(new Date(progress.date)).getTime() >= startOfWeek.getTime()
            );

            if (!weeklyProgress?.completed) {
                await sendReminder(habit, 'Weekly');
            } else {
                console.log(`Habit "${habit.name}" already completed for this week`);
            }
        }

        console.log(`Weekly habit reminders processed for ${habits.length} habits`);
    } catch (error) {
        console.error('Error in weekly habit reminder:', error);
    }
});

// Monthly reminder cron job - 8:00 AM on the first day of each month
export const monthlyHabitReminder = cron.schedule('0 8 1 * *', async () => {
    try {
        const habits = await Habit.find({ frequency: 'monthly' });
        const startOfMonth = getStartOfMonth(new Date());

        for (const habit of habits) {
            const monthlyProgress = habit.progress.find(progress => 
                getStartOfDay(new Date(progress.date)).getTime() >= startOfMonth.getTime()
            );

            if (!monthlyProgress?.completed) {
                await sendReminder(habit, 'Monthly');
            } else {
                console.log(`Habit "${habit.name}" already completed for this month`);
            }
        }

        console.log(`Monthly habit reminders processed for ${habits.length} habits`);
    } catch (error) {
        console.error('Error in monthly habit reminder:', error);
    }
});