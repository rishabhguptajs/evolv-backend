import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/userSchema";

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
            try {
                let user = await User.findOne({ "personal_info.email": profile.emails[0].value });

                if (!user) {
                    user = new User({
                        personal_info: {
                            first_name: profile.name.givenName,
                            last_name: profile.name.familyName,
                            email: profile.emails[0].value,
                        },
                        oauth_info: [{
                            provider: "google",
                            provider_id: profile.id,
                            access_token: accessToken,
                            refresh_token: refreshToken,
                            expires_at: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                        }],
                    });
                    await user.save();
                } else {
                    // Update existing user with Google provider info if not already present
                    const existingOauth = user.oauth_info?.find(oauth => oauth.provider_id === profile.id);
                    if (!existingOauth) {
                        user.oauth_info!.push({
                            provider: "google",
                            provider_id: profile.id,
                            access_token: accessToken,
                            refresh_token: refreshToken,
                            expires_at: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
                        });
                        await user.save();
                    }
                }
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// Github OAuth Strategy
passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            callbackURL: "/auth/github/callback",
        },
        async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
            try {
                let user = await User.findOne({ "personal_info.email": profile.emails[0].value });

                if (!user) {
                    user = new User({
                        personal_info: {
                            first_name: profile.displayName,
                            email: profile.emails[0].value,
                        },
                        oauth_info: [{
                            provider: "github",
                            provider_id: profile.id,
                            access_token: accessToken,
                            refresh_token: refreshToken,
                            expires_at: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                        }],
                    });
                    await user.save();
                } else {
                    // Update existing user with GitHub provider info if not already present
                    const existingOauth = user.oauth_info?.find(oauth => oauth.provider_id === profile.id);
                    if (!existingOauth) {
                        user.oauth_info!.push({
                            provider: "github",
                            provider_id: profile.id,
                            access_token: accessToken,
                            refresh_token: refreshToken,
                            expires_at: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
                        });
                        await user.save();
                    }
                }
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// Facebook OAuth Strategy
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID as string,
            clientSecret: process.env.FACEBOOK_APP_SECRET as string,
            callbackURL: "/auth/facebook/callback",
        },
        async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
            try {
                let user = await User.findOne({ "personal_info.email": profile.emails[0].value });

                if (!user) {
                    user = new User({
                        personal_info: {
                            first_name: profile.name.givenName,
                            last_name: profile.name.familyName,
                            email: profile.emails[0].value,
                        },
                        oauth_info: [{
                            provider: "facebook",
                            provider_id: profile.id,
                            access_token: accessToken,
                            refresh_token: refreshToken,
                            expires_at: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                        }],
                    });
                    await user.save();
                } else {
                    // Update existing user with Facebook provider info if not already present
                    const existingOauth = user.oauth_info?.find(oauth => oauth.provider_id === profile.id);
                    if (!existingOauth) {
                        user.oauth_info!.push({
                            provider: "facebook",
                            provider_id: profile.id,
                            access_token: accessToken,
                            refresh_token: refreshToken,
                            expires_at: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
                        });
                        await user.save();
                    }
                }
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
)

// Serialize user
passport.serializeUser((user: any, done) => {
    // store user.id and user.personal_info.email in session
    done(null, {
        id: user.id,
        email: user.personal_info.email,
    })
});

// Deserialize user
passport.deserializeUser((id, done) => {
    User.findById(id, (err: any, user: boolean | Express.User | null | undefined) => {
        done(err, user);
    });
});

export default passport;