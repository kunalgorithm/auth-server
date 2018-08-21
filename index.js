
// start server by writing `node index.js`
// use `npm run dev` to run nodemon from the script in package.json
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.connect('mongodb://localhost/auth', { useNewUrlParser: true })
// App Setup
// Morgan is basically just a logging middleware and we are 
// using it for debugging
app.use(morgan('combined'));

// use CORS to allow requests from any domain names 
app.use(cors());
app.use(bodyParser.json({type: '*/*'}));
router(app);
// Server Setup 
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);