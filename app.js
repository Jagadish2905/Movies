const express = require('express');
require('dotenv').config();
const mongooseConfig = require('./config/mongoose');
const userRoutes = require('./routes/users.router');
const movieRoutes = require('./routes/movie.router');
const path = require('path')

const bodyParser = require('body-parser')
const app = express();
const port = process.env.APP_PORT;
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.get('/', (req, res) => res.send('WELCOME TO API'));
app.use('/api/', userRoutes);
app.use('/api/v1/', movieRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.message = 'Invalid route';
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({
        error: {
            message: error.message,
        },
    });
});
async function dbConnect() {
    try {
        await mongooseConfig.connectToServer();
        console.log('connected now to mongo db');
    } catch (error) {
        console.log('error in mongo connection', error);
    }
}

dbConnect();
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});