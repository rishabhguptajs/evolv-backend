import { Request, Response } from 'express';
import User from '../models/userSchema';
import { UserInterface } from '../interfaces/userInterface';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const getUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userID: string = req.params.id;

        if (!userID) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user: UserInterface | null = await User.findById(userID).select('-password -oauth_info');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ 
            user,
            message: "User details fetched successfully!" 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting user profile", error: error instanceof Error ? error.message : error });
    }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userID = req.params.id;
        const { first_name, last_name, email, phone, address }: { first_name: string; last_name: string; email: string; phone?: string; address?: string } = req.body;

        if (!userID) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!first_name || typeof first_name !== 'string') {
            return res.status(400).json({ message: "Valid first name is required" });
        }
        if (!last_name || typeof last_name !== 'string') {
            return res.status(400).json({ message: "Valid last name is required" });
        }
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: "Valid email is required" });
        }
        if (phone && typeof phone !== 'string') {
            return res.status(400).json({ message: "Phone number must be a string" });
        }
        if (address && typeof address !== 'string') {
            return res.status(400).json({ message: "Address must be a string" });
        }

        const existingUser = await User.findOne({ 'personal_info.email': email, _id: { $ne: userID } });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use by another account" });
        }

        const updatedUser: UserInterface | null = await User.findByIdAndUpdate(
            userID,
            {
                'personal_info.first_name': first_name,
                'personal_info.last_name': last_name,
                'personal_info.email': email,
                'personal_info.phone_number': phone,
                'personal_info.address': address
            },
            { new: true, runValidators: true }
        ).select('-password -oauth_info');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ 
            user: updatedUser,
            message: "User profile updated successfully!" 
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Error updating user profile", error: error instanceof Error ? error.message : error });
    }
};

export const deleteUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userID = req.params.id;

        if (!userID) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const deletedUser: UserInterface | null = await User.findByIdAndDelete(userID);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User profile deleted successfully!" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting user profile", error: error instanceof Error ? error.message : error });
    }
};

export const getUserLinks = async (req: Request, res: Response): Promise<Response> => {
    const userID = req.params.id;

    if (!userID) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user: UserInterface | null = await User.findById(userID).select('oauth_info');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const linksWithDetails = user.oauth_info?.map(link => ({
            provider: link.provider,
            expires_at: link.expires_at,
        }));

        return res.status(200).json({ 
            links: linksWithDetails,
            message: "User links fetched successfully"
        });
    } catch (error: any) {
        console.error("Error fetching user links:", error);
        return res.status(500).json({ message: "Error getting user links", error: error instanceof Error ? error.message : "Internal server error" });
    }
};

export const updateProfilePicture = [upload.single('profilePhoto'), async (req: Request, res: Response): Promise<Response> => {
    try {
        const userID = req.params.id;

        if (!userID) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Profile photo is required" });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.profile_pic = req.file.buffer;

        await user.save();

        return res.status(200).json({ message: "Profile picture updated successfully!" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Error updating profile picture", error: error instanceof Error ? error.message : error });
    }
}];