import Person from '../models/person.js'

export const getPeople = async (req, res) => {
    const limit = req.body?.limit || 20

    const people = await Person.find().limit(limit)

    return res.status(200).json(people)
}

export const createPerson =  async (req, res) => {
    const fields = req.body?.fields

    // Create new person

    try {
        const person = new Person({
            fields: fields
        })

        await person.save()

        return res.status(201).json({
            message: 'Person created successfully.',
            person
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

export const getPerson = async (req, res) => {
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
}

export const updatePerson = async (req, res) => {
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
}

export const deletePerson = async (req, res) => {
    const id = req.params?.id

    // Find and delete person

    try {
        const person = await Person.findByIdAndDelete(id)

        if (person) return res.status(200).json({
            message: 'Person deleted successfully.'
        })

        return res.status(404).json({
            message: 'Person not found.'
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}