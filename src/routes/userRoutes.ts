import express from "express"
import { getUserLinks, getUserProfile, updateUserProfile } from "../controllers/userController"

const router = express.Router()

router.get("/profile/:id", async (req, res) => {
  try {
    await getUserProfile(req, res);
  } catch (error: any) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
});

router.patch("/profile/:id", async(req, res) => {
  try {
    await updateUserProfile(req, res);
  } catch (error: any) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
});

router.get("/profile/links/:id", async (req, res) => {
  try {
    await getUserLinks(req, res);
  } catch (error: any) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});

export default router;