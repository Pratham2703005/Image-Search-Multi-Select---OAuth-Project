import express from "express";
import passport from "passport";

const router = express.Router();

// Middleware to check if user is authenticated
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Pre-login: clear any existing session and then start provider auth
router.get('/login/:provider', (req, res) => {
  const { provider } = req.params;
  const allowed = ['google', 'facebook', 'github'];
  if (!allowed.includes(provider)) {
    return res.status(400).send('Invalid provider');
  }

  const startAuth = () => res.redirect(`/api/auth/${provider}`);

  // Try to logout and destroy any existing session so OAuth starts fresh
  if (typeof req.logout === 'function') {
    try {
      req.logout(() => {
        if (req.session) {
          req.session.destroy(() => {
            res.clearCookie('connect.sid');
            startAuth();
          });
        } else {
          startAuth();
        }
      });
    } catch (e) {
      // If logout throws for any reason, still attempt to destroy session
      if (req.session) {
        req.session.destroy(() => {
          res.clearCookie('connect.sid');
          startAuth();
        });
      } else {
        startAuth();
      }
    }
  } else {
    // No logout function available, just destroy session if present
    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        startAuth();
      });
    } else {
      startAuth();
    }
  }
});

// Google Auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      if (err) {
        console.error('Google OAuth error:', err);
        return res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage({ type: 'oauth-error', error: 'Authentication failed' }, '${process.env.CLIENT_URL}');
                window.close();
              </script>
            </body>
          </html>
        `);
      }
      
      if (!user) {
        console.error('Google OAuth: No user returned');
        return res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage({ type: 'oauth-error', error: 'No user found' }, '${process.env.CLIENT_URL}');
                window.close();
              </script>
            </body>
          </html>
        `);
      }

      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.send(`
            <html>
              <body>
                <script>
                  window.opener.postMessage({ type: 'oauth-error', error: 'Login failed' }, '${process.env.CLIENT_URL}');
                  window.close();
                </script>
              </body>
            </html>
          `);
        }

        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.send('<script>window.close()</script>');
          }
          console.log('Session saved successfully for user:', user.displayName);
          res.send(`
            <html>
              <body>
                <script>
                  window.opener.postMessage({ type: 'oauth-success' }, '${process.env.CLIENT_URL}');
                  window.close();
                </script>
              </body>
            </html>
          `);
        });
      });
    })(req, res, next);
  }
);

// Facebook Auth
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  (req, res, next) => {
    passport.authenticate("facebook", (err, user, info) => {
      if (err) {
        console.error('Facebook OAuth error:', err);
        return res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage({ type: 'oauth-error', error: 'Authentication failed' }, '${process.env.CLIENT_URL}');
                window.close();
              </script>
            </body>
          </html>
        `);
      }
      
      if (!user) {
        console.error('Facebook OAuth: No user returned');
        return res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage({ type: 'oauth-error', error: 'No user found' }, '${process.env.CLIENT_URL}');
                window.close();
              </script>
            </body>
          </html>
        `);
      }

      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.send(`
            <html>
              <body>
                <script>
                  window.opener.postMessage({ type: 'oauth-error', error: 'Login failed' }, '${process.env.CLIENT_URL}');
                  window.close();
                </script>
              </body>
            </html>
          `);
        }

        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.send('<script>window.close()</script>');
          }
          console.log('Session saved successfully for user:', user.displayName);
          res.send(`
            <html>
              <body>
                <script>
                  window.opener.postMessage({ type: 'oauth-success' }, '${process.env.CLIENT_URL}');
                  window.close();
                </script>
              </body>
            </html>
          `);
        });
      });
    })(req, res, next);
  }
);

// GitHub Auth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  (req, res, next) => {
    passport.authenticate("github", (err, user, info) => {
      if (err) {
        console.error('GitHub OAuth error:', err);
        return res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage({ type: 'oauth-error', error: 'Authentication failed' }, '${process.env.CLIENT_URL}');
                window.close();
              </script>
            </body>
          </html>
        `);
      }
      
      if (!user) {
        console.error('GitHub OAuth: No user returned');
        return res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage({ type: 'oauth-error', error: 'No user found' }, '${process.env.CLIENT_URL}');
                window.close();
              </script>
            </body>
          </html>
        `);
      }

      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.send(`
            <html>
              <body>
                <script>
                  window.opener.postMessage({ type: 'oauth-error', error: 'Login failed' }, '${process.env.CLIENT_URL}');
                  window.close();
                </script>
              </body>
            </html>
          `);
        }

        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.send('<script>window.close()</script>');
          }
          console.log('Session saved successfully for user:', user.displayName);
          res.send(`
            <html>
              <body>
                <script>
                  window.opener.postMessage({ type: 'oauth-success' }, '${process.env.CLIENT_URL}');
                  window.close();
                </script>
              </body>
            </html>
          `);
        });
      });
    })(req, res, next);
  }
);

// Get current user
router.get("/user", (req, res) => {
  console.log("Session data:", req.isAuthenticated(), req.user);
  if (req.isAuthenticated() && req.user) {
    res.json({
      user: {
        id: req.user._id,
        displayName: req.user.displayName,
        email: req.user.email,
        photo: req.user.photo,
        provider: req.user.provider
      }
    });
  } else {
    // Don't destroy session - just return 401
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error destroying session" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });
});

export default router;
