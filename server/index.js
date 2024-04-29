require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const DOCKER_PORT = process.env.DOCKER_PORT;
const db = require('./models');
const cors = require('cors');
const body_parser = require('body-parser');
const rateLimitRequest = require('express-rate-limit');

const limiter = rateLimitRequest.rateLimit({
    windowMs: 5 * 60 * 100, // Trong vòng 5 phút
    max: 150,                // cho phép gửi 150 requests
    message: 'Bạn đang gửi quá nhiều yêu cầu trong một thời điểm. Vui lòng đợi...'
});

app.use(limiter);
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
const booksRouter = require('./routes/Books');
const approveRouter = require('./routes/Approve');
const storetypesRouter = require('./routes/Storetypes');
const statusdocRouter = require('./routes/Statusdoc');
const searchRouter = require('./routes/Search');
const barcodeRouter = require('./routes/Barcode');
const rolesRouter = require('./routes/Roles');

app.use('/users', usersRouter);
app.use('/bills', billsRouter);
app.use('/authen', authenRouter);
app.use('/newpassword', createNewPassRouter);
app.use('/rooms', roomsRouter);
app.use('/positions', positionsRouter);
app.use('/books', booksRouter);
app.use('/approve', approveRouter);
app.use('/storetypes', storetypesRouter);
app.use('/statusdoc', statusdocRouter);
app.use('/search', searchRouter);
app.use('/barcode', barcodeRouter);
app.use('/roles', rolesRouter);

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}, connect to port ${DOCKER_PORT} of Docker`)
    });
});