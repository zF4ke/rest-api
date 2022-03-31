import express from 'express';
const router = express.Router()

/* /people */

router.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Getting all people'
    })
})

router.post('/', (req, res) => {
    return res.status(200).json({
        message: 'Create a new person'
    })
})

/* /people/:id */

router.get('/:id', (req, res) => {
    return res.status(200).json({
        message: `Getting a single person with id ${req.params.id}`
    })
})

router.patch('/:id', (req, res) => {
    return res.status(200).json({
        message: `Editing a single person with id ${req.params.id}`
    })
})

router.delete('/:id', (req, res) => {
    return res.status(200).json({
        message: `Deleting a single person with id ${req.params.id}`
    })
})

export default router