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

app
    .use(bodyParser.json())
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    }))

    .use(passport.initialize())
    .use(passport.session())

    /*app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept,Z-Key'
        );
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        next();
    })*/
    .use(cors({
        origin: '*',
        methods: ['GET, POST, PUT, DELETE']
    }))
    .use('/', require('./routes'));

// Error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: 'Internal server error'
    });
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACKURL
},
    function (accessToken, refreshToken, profile, done) {
        //User.findOrCreate({githubId: profile.id}, function (err, user){
        return done(null, profile);
        // });
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out") })

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: 'api-docs', session: false
}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

mongodb.initDB((err) => {
    if (err) {
        console.log(err);
    } else {
        // Start "listening" for requests
        app.listen(port, () => {
            console.log(`DataBase is listening and Node is running on port ${port}`);
        });
    }
});
