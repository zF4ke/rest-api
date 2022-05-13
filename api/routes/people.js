import express from 'express';
const router = express.Router()
import check from 'check-types'

import checkAuth from '../middleware/checkAuth.js'
import { createPerson, deletePerson, getPeople, getPerson, updatePerson } from '../controllers/people.js';

/* /people */

router.get('/', checkAuth, validateLimit, getPeople)

router.post('/', checkAuth, validateFields, createPerson)
 
/* /people/:id */

router.get('/:id', checkAuth, validateId, getPerson)

router.patch('/:id', checkAuth, validateId, validateFields, updatePerson)

router.delete('/:id', checkAuth, validateId, deletePerson)

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

function validateLimit(req, res, next) {
    const limit = req.body?.limit

    // Check if limit is valid

    if (limit <= 0) return res.status(400).json({
        message: 'Limit must be greater than 0'
    })
    
    next()
}

export default router