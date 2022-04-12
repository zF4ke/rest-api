import express from 'express';
const router = express.Router()
import bcrypt from 'bcrypt';
import check from 'check-types'
import jwt from 'jsonwebtoken';

import User from '../models/user.js'

import checkAuth from '../middleware/checkAuth.js'

/* /users */

router.get('/', checkAuth, async (req, res) => {
    const users = await User.find()

    return res.status(200).json(users)
})

/*
 * @param {string} username
 * @param {string} password
 */

router.post('/signup', checkAuth, validateUser, async (req, res) => {
    const username = req.body?.username
    const password = req.body?.password

    try {
        // Check if user already exists

        const findUser = await User.findOne({ username })
        if(findUser) return res.status(409).json({
            message: 'Username already exists'
        })

        // Hash password

        const hash = bcrypt.hashSync(password, 10)

        // Create new user

        const user = new User({
            username,
            password: hash
        })

        await user.save()

        res.status(201).json({
            message: 'User created successfully.',
            user
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Internal server error'
        })
    }
})

router.post('/login', async (req, res) => {
    const username = req.body?.username
    const password = req.body?.password

    if (!check.assigned(username)) return res.status(400).json({
        message: 'Missing username'
    })

    if (!check.assigned(password)) return res.status(400).json({
        message: 'Missing password'
    })

    try {

        // Check if user exists

        const user = await User.findOne({ username })
        if (!user) return res.status(401).json({
            message: 'Invalid username or password'
        })

        // Check if password is correct

        const isValid = bcrypt.compareSync(password, user.password)
        if (!isValid) return res.status(401).json({
            message: 'Invalid username or password'
        })

        // Create token

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET)

        res.status(200).json({
            message: 'Login successful',
            token
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Internal server error'
        })
    }
})

/* /users/:id */

/*
 * @param {id} id
 */

router.get('/:id', checkAuth, validateId, async (req, res) => {
    const id = req.params?.id

    // Find and return user

    try {
        const user = await User.findById(id)

        return res.status(200).json(user)

    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

/*
 * @param {id} id
 */

router.patch('/:id', checkAuth, (req, res) => {
    return res.status(200).json({
        message: `Editing a single user with id ${req.params.id}`
    })
})

/*
 * @param {id} id
 */

router.delete('/:id', checkAuth, validateId, async (req, res) => {
    const id = req.params?.id

    // Find and delete user

    try {
        const user = await User.findByIdAndDelete(id)

        if (check.assigned(user)) return res.status(200).json({
            message: 'User deleted successfully.'
        })

        return res.status(404).json({
            message: 'User not found.'
        })

    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

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