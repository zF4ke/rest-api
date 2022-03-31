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


app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))