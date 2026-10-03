// Import Express to create and configure the web server
const express = require('express');
const bodyParser = require('body-parser');

// Workaround for DNS resolution issues (Node is using 127.0.0.1 instead of a public DNS server)
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongodb = require('./data/database');
const passport = require('passport')
const session = require('express-session')
const cors = require('cors');
const GitHubStrategy = require('passport-github2').Strategy;
// Create a new Express application instance
const app = express();

// server port that will listen for incoming requests from the frontend
const port = process.env.PORT || 3000;

process.on('uncaughtException', err => console.error('UNCAUGHT:', err));
process.on('unhandledRejection', err => console.error('UNHANDLED:', err));

// Render finishes HTTPS in its proxy
app.set('trust proxy', 1);

app
    .use(bodyParser.json())
    .use(cors({
        origin: '*',
        methods: ['GET, POST, PUT, DELETE']
    }))
    .use(session({
        secret: process.env.SESSION_SECRET || 'dev-secret',
        resave: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        }
    }))
    .use(passport.initialize())
    .use(passport.session());

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACKURL
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Auth routes before the main routes to ensure that the user is authenticated before accessing any other routes
app.get('/', (req, res) => {
    res.send(
        req.session.user !== undefined
            ? `Logged in as ${req.session.user.username}`
            : 'Logged Out'
    );
});

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/api-docs', session: false }),
    (req, res, next) => {
        console.log('Callback OK, user:', req.user && req.user.username);
        req.session.user = {
            id: req.user.id,
            username: req.user.username,
            displayName: req.user.displayName
        };
        // Wait until the session is saved before redirecting to avoid a race condition
        req.session.save(err => (err ? next(err) : res.redirect('/')));
    });

app.use('/', require('./routes'));

// Error handler (Always after all other middleware and routes)
app.use((err, req, res, next) => {
    console.error('EXPRESS ERROR:', err);
    res.status(500).json({ error: 'Internal server error', detail: err.message });
});

mongodb.initDB((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`DataBase is listening and Node is running on port ${port}`);
        });
    }
});
