// Import Express to create and configure the web server
const express = require('express');
const bodyParser = require('body-parser');

// Workaround for DNS resolution issues (Node is using 127.0.0.1 instead of a public DNS server)
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongodb = require('./data/database');
// Create a new Express application instance
const app = express();

// server port that will listen for incoming requests from the frontend
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept,Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.use('/', require('./routes'));

// Error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: 'Internal server error'
    });
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
