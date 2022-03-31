import express from 'express';
const router = express.Router()

/* /people */

router.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Getting all people'
    })
})

/*
 * @param {array} fields
 */

router.post('/', (req, res) => {
    return res.status(200).json({
        message: 'Creating a new person'
    })
})

/* /people/:id */

/*
 * @param {id} id
 */

router.get('/:id', (req, res) => {
    return res.status(200).json({
        message: `Getting a single person with id ${req.params.id}`
    })
})

/*
 * @param {array} fields
 */

router.patch('/:id', (req, res) => {
    return res.status(200).json({
        message: `Editing a single person with id ${req.params.id}`
    })
})

/*
 * @param {id} id
 */

router.delete('/:id', (req, res) => {
    return res.status(200).json({
        message: `Deleting a single person with id ${req.params.id}`
    })
})

export default router