import { faker } from "@faker-js/faker";
import fs from "fs";

function createRandomUser() {
    return {
        user_id: faker.string.uuid(),
        habit_details: {
            habit_id: faker.string.uuid(),
            name: faker.helpers.arrayElement(['exercise', 'reading', 'meditation', 'coding', 'writing', 'drawing', 'cooking', 'cleaning', 'studying', 'socializing', 'working', 'relaxing', 'sleeping', 'eating', 'drinking', 'shopping', 'watching', 'listening', 'playing', 'creating', 'learning', 'teaching', 'helping', 'volunteering', 'donating', 'recycling', 'upcycling', 'downcycling', 'cycling', 'running', 'walking', 'hiking', 'swimming', 'biking', 'skating', 'skiing', 'snowboarding', 'surfing', 'skateboarding', 'scootering', 'rollerblading', 'rockclimbing', 'bouldering', 'mountaineering', 'canyoneering', 'caving', 'gaming', 'photography', 'traveling', 'yoga', 'dancing', 'painting', 'gardening', 'fishing', 'camping', 'hunting', 'birdwatching', 'star-gazing', 'knitting', 'sewing', 'woodworking', 'playing an instrument', 'singing', 'acting', 'writing poetry', 'writing stories', 'journaling', 'practicing mindfulness', 'practicing gratitude', 'practicing self-care', 'practicing self-reflection', 'practicing self-improvement']),
            description: faker.lorem.sentence(),
            frequency: faker.helpers.arrayElement(['daily', 'weekly', 'monthly']),
            target: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 14, 21, 28, 30, 60, 90, 180, 365]),
            progress: Array.from({ length: faker.number.int({ min: 1, max: 30 }) }, () => ({
                date: faker.date.recent(30),
                completed: faker.datatype.boolean(),
            })),
            streak: faker.helpers.arrayElement([0, 1, 2, 3, 4, 5, 6, 7, 14, 21, 28, 30, 60, 90, 180, 365]),
            reminders: [
                {
                    time: faker.date.recent(),
                    frequency: faker.helpers.arrayElement(['once', 'daily', 'weekly', 'monthly'])
                }
            ]
        },
        name: faker.person.fullName(),
        status: faker.helpers.arrayElement(["completed", "in_progress", "incomplete"])
    }
}

// Generate 1000 random users and their habits without projection data
const users = Array.from({ length: 1000 }, () => createRandomUser());

// Write the synthetic data to a file
fs.writeFileSync("syntheticData.json", JSON.stringify(users, null, 2));

console.log("Synthetic data generated successfully!");