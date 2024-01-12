const fs = require('fs');
const path = require('path');

require('dotenv').config({path : './config.env'})

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const Goal = require('./models/goal');


const goalsRouter = require('./routes/goalsRoutes');
const usersRouter = require('./routes/userRoutes');
const gptRouter = require('./routes/gptRoutes');
const recipeRouter = require('./routes/recipeRoutes');
const searchRouter = require('./routes/searchRoutes');

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

// app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.use("/api/v1/goals", goalsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/gpt", gptRouter);
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/search", searchRouter);






mongoose.connect(
  'mongodb://mongoadmin:mongoadmin@mongo:27017',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('FAILED TO CONNECT TO MONGODB');
      console.error(err);
    } else {
      console.log('CONNECTED TO MONGODB WITH SUCCESS');
      app.listen(81);
    }
  }
);
