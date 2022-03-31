import mongoose from 'mongoose'

const personSchema = new mongoose.Schema({
    fields: {
        type: Array
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Person', personSchema)