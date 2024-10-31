import express from "express"
import passport from "passport"
import {
  loginController,
  signupController,
} from "../controllers/authController"

const router = express.Router()

// @desc    Auth with Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:3000/dashboard")
  }
)

// @desc    Auth with Github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["profile", "email"] })
)

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:3000/dashboard")
  }
)

// @desc    Logout User
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send(err)
    }
    res.redirect("http://localhost:3000")
  })
})

// @desc    Sign Up using Email and Password
router.post("/signup", async (req, res) => {
  try {
    await signupController(req, res)
  } catch (error) {
    res.status(500).json({ message: "Error during signup", error })
  }
})

// @desc    Login using Email and Password
router.post("/login", async (req, res) => {
  try {
    await loginController(req, res)
  } catch (error) {
    res.status(500).json({ message: "Error during login", error })
  }
})

export default router