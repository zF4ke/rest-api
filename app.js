import 'dotenv/config'
import express from 'express';
import morgan from 'morgan';

/* App */
const app = express()

app.use(morgan('dev'))

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