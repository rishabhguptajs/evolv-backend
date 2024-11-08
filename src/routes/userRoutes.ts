import express from "express"
import { deleteUserProfile, getUserLinks, getUserProfile, updateUserProfile } from "../controllers/userController"
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const router = express.Router()

router.get("/profile/:id", ensureAuthenticated, async (req, res) => {
  try {
    await getUserProfile(req, res);
  } catch (error: any) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
});

router.patch("/profile/:id", ensureAuthenticated, async(req, res) => {
  try {
    await updateUserProfile(req, res);
  } catch (error: any) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
});

router.delete("/profile/:id", ensureAuthenticated, async(req, res) => {
  try {
    await deleteUserProfile(req, res);
  } catch (error: any) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile/links/:id", ensureAuthenticated, async (req, res) => {
  try {
    await getUserLinks(req, res);
  } catch (error: any) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});

export default router;