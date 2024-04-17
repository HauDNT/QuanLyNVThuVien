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
const billsRouter = require('./routes/Bills');
const authenRouter = require('./routes/Authen');
const createNewPassRouter = require('./routes/CreateNewPassword');
const roomsRouter = require('./routes/Rooms');
const positionsRouter = require('./routes/Positions');


app.use('/users', usersRouter);
app.use('/bills', billsRouter);
app.use('/authen', authenRouter);
app.use('/newpassword', createNewPassRouter);
app.use('/rooms/', roomsRouter);
app.use('/positions/', positionsRouter);

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}, connect to port ${DOCKER_PORT} of Docker`)
    });
});