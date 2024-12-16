import express, { Request, Response, Router } from "express"
import passport from "../config/passport"
import {
  loginController,
  signupController,
} from "../controllers/authController"

const router: Router = express.Router()

// @desc    Auth with Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    
    // Set user data in HTTP-only cookie
    res.cookie('user', JSON.stringify({
      email: user.personal_info.email,
      firstName: user.personal_info.first_name,
      lastName: user.personal_info.last_name,
      profilePicture: user.personal_info.profile_picture,
      provider: 'google'
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.redirect(process.env.CLIENT_REDIRECT_URL || "http://localhost:3000/dashboard")
  }
)

// @desc   Auth with Facebook
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }))

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    
    // Set user data in HTTP-only cookie
    res.cookie('user', JSON.stringify({
      email: user.personal_info.email,
      firstName: user.personal_info.first_name,
      lastName: user.personal_info.last_name,
      profilePicture: user.personal_info.profile_picture,
      provider: 'facebook'
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.redirect(process.env.CLIENT_REDIRECT_URL || "http://localhost:3000/dashboard")
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
  (req: Request, res: Response) => {
    const user = req.user as any;
    
    // Set user data in HTTP-only cookie
    res.cookie('user', JSON.stringify({
      email: user.personal_info.email,
      firstName: user.personal_info.first_name,
      lastName: user.personal_info.last_name,
      profilePicture: user.personal_info.profile_picture,
      username: user.personal_info.username,
      provider: 'github'
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.redirect(process.env.CLIENT_REDIRECT_URL || "http://localhost:3000/dashboard")
  }
)

// @desc    Logout User
router.get("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({ message: "Logout error", error: err })
    }
    // Clear the cookie on logout
    res.clearCookie('user');
    res.redirect(process.env.CLIENT_REDIRECT_URL || "http://localhost:3000")
  })
})

// @desc    Sign Up using Email and Password
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const result = await signupController(req, res)
    res.status(201).json({ message: "Signup successful", data: result })
  } catch (error) {
    res.status(500).json({ message: "Error during signup", error })
  }
})

// @desc    Login using Email and Password
router.post("/login", async (req: Request, res: Response) => {
  try {
    const result = await loginController(req, res)
    res.status(200).json({ message: "Login successful", data: result })
  } catch (error) {
    res.status(500).json({ message: "Error during login", error })
  }
})

export default router
