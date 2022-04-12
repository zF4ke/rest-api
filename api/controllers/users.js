import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js'

export const getAllUsers = async (req, res) => {
    const users = await User.find()

    return res.status(200).json(users)
}

export const getUser = async (req, res) => {
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
}

export const createUser = async (req, res) => {
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
}

export const signIn = async (req, res) => {
    const username = req.body?.username
    const password = req.body?.password
    
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
}

export const updateUser = (req, res) => {
    return res.status(200).json({
        message: `Editing a single user with id ${req.params.id}`
    })
}

export const deleteUser = async (req, res) => {
    const id = req.params?.id

    // Find and delete user

    try {
        const user = await User.findByIdAndDelete(id)

        if (user) return res.status(200).json({
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
}