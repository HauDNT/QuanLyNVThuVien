require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const DOCKER_PORT = process.env.DOCKER_PORT;
const db = require('./models');
const cors = require('cors');
const body_parser = require('body-parser');

app.use(body_parser.urlencoded({extended: true}));
app.use(body_parser.json());
app.use(cors());

// Init routes:
const usersRouter = require('./routes/Users');
app.use('/users', usersRouter);

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}, connect to port ${DOCKER_PORT} of Docker`)
    });
});