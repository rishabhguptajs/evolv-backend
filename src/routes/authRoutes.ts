import express from 'express'
import passport from 'passport'

const router = express.Router()

// @desc    Auth with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("http://localhost:3000/dashboard")
    }
)

// @desc    Auth with Github
router.get('/github', passport.authenticate('github', { scope: ['profile', 'email'] }))

export default router