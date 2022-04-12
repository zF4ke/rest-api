import express from 'express';
const router = express.Router()
import check from 'check-types'

import checkAuth from '../middleware/checkAuth.js'
import { createUser, deleteUser, getAllUsers, getUser, signIn, updateUser } from '../controllers/users.js'

/* /users */

router.get('/', checkAuth, getAllUsers)

router.post('/signup', checkAuth, validateUser, createUser)

router.post('/login', validateUser, signIn)

/* /users/:id */

router.get('/:id', checkAuth, validateId, getUser)

router.patch('/:id', checkAuth, updateUser)

router.delete('/:id', checkAuth, validateId, deleteUser)

function validateUser(req, res, next) {
    const username = req.body?.username
    const password = req.body?.password

    if (!check.assigned(username)) return res.status(400).json({
        message: 'Missing username'
    })

    if (!check.assigned(password)) return res.status(400).json({
        message: 'Missing password'
    })

    if (!check.greaterOrEqual(username.length, 3)) return res.status(400).json({
        message: 'Username must be at least 3 characters'
    })

    if (!check.greaterOrEqual(password.length, 6)) return res.status(400).json({
        message: 'Password must be at least 6 characters'
    })

    if (hasWhiteSpace(username)) return res.status(400).json({
        message: 'Username cannot contain spaces'
    })

    if (hasWhiteSpace(password)) return res.status(400).json({
        message: 'Password cannot contain spaces'
    })

    function hasWhiteSpace(s) {
        return /\s/g.test(s);
    }

    next()
}

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

export default router