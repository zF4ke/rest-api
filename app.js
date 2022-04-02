import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

/* App */
const app = express()

/* Logging */
app.use(morgan('dev'))

/* Body Parser */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* Database */
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })

/* CORS */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

/* Routes */
import peopleRoute from "./api/routes/people.js"
import usersRoute from "./api/routes/users.js"

app.use('/people', peopleRoute)
app.use('/users', usersRoute)

/* Handle 404 error */
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

/* Handle 5xx error */
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))


/* Prevents Crashing */
process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});
  