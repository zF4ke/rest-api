import check from 'check-types'
import express from 'express';
const router = express.Router()

import Person from '../models/person.js'

/* /people */

router.get('/', async (req, res) => {
    const people = await Person.find()

    return res.status(200).json(people)
})

/*
 * @param {array} fields
 */

router.post('/', validateFields, async (req, res) => {
    const fields = req.body?.fields

    // Create new person

    try {
        const person = new Person({
            fields: fields
        })

        await person.save()

        return res.status(200).json({
            message: 'Person created successfully.',
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})
 
/* /people/:id */

/*
 * @param {id} id
 */

router.get('/:id', validateId, async (req, res) => {
    const id = req.params?.id

    // Find and return person

    try {
        const person = await Person.findById(id)

        return res.status(200).json(person)

    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

/*
 * @param {id} id
 * @param {array} fields
 */

router.patch('/:id', validateId, validateFields, async (req, res) => {
    const id = req.params?.id
    const fields = req.body?.fields

    // Find and update person

    try {
        await Person.findByIdAndUpdate(id, {
            fields,
            updatedAt: Date.now()
        })

        return res.status(200).json({
            message: 'Person updated successfully.',
        })
        
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

/*
 * @param {id} id
 */

router.delete('/:id', validateId, async (req, res) => {
    const id = req.params?.id

    // Find and delete person

    try {
        const person = await Person.findByIdAndDelete(id)

        if (check.assigned(person)) return res.status(200).json({
            message: 'Person deleted successfully.'
        })

        return res.status(404).json({
            message: 'Person not found.'
        })

    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

function validateId(req, res, next) {
    const id = req.params?.id

    // Check if id is valid

    if (check.emptyString(id)) return res.status(400).json({
        message: 'Missing id'
    })

    if (!check.hasLength(id, 24)) return res.status(400).json({
        message: 'Invalid id'
    })

    next()
}

function validateFields(req, res, next) {
    const fields = req.body?.fields

    // Check if fields is an array of non empty objects

    if (!check.assigned(fields)) return res.status(400).json({
        message: 'Missing fields'
    })

    if (!check.array.of.object(fields)) return res.status(400).json({
        message: 'Fields must be an array of objects'
    })

    if (check.all(check.map(fields, field => check.emptyObject(field)))) return res.status(400).json({
        message: 'Fields array must not be empty'
    })

    next()
}


export default router