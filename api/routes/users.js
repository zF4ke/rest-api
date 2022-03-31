import express from 'express';
const router = express.Router()

/* /users */

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Getting all users'
    })
})

router.post('/', (req, res) => {
    res.status(200).json({
        message: 'Creating a new user'
    })
})

/* /users/:id */

router.get('/:id', (req, res) => {
    res.status(200).json({
        message: `Getting a single user with id ${req.params.id}`
    })
})

router.patch('/:id', (req, res) => {
    return res.status(200).json({
        message: `Editing a single user with id ${req.params.id}`
    })
})

router.delete('/:id', (req, res) => {
    return res.status(200).json({
        message: `Deleting a single user with id ${req.params.id}`
    })
})

export default router