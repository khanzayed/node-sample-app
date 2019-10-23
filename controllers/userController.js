const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

const User = require('../database/models/user')

router.post('/register', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.validateData()

        const count = await user.checkIfAlreadyExist()
        if (count !== 0) {
            return res.status(400).send('Unable to create an account!')
        }
        
        user.generateToken()

        await user.save()
        res.status(200).send({ 
            user,
            token: user.token
        })
    } catch (e) {
        res.status(400).send('Unable to create an account!')
    }
})

router.post('/login', async (req, res) => {    
    try {
        if ((req.body.password === undefined) || (req.body.email === undefined)) {
            throw new Error('Invalid inputs for login!')
        }

        const user = await User.getUserByEmailAndPassword(req.body.email, req.body.password)
        if (user === undefined) {
            return res.status(400).send('Unable to login!')
        }
        user.generateToken()
        await user.save()

        res.status(200).send({ 
            user,
            token: user.token
        })
    } catch (e) {
        res.status(400).send(e.toString())
    }
})

router.get('/details', auth, async (req, res) => {
    try {
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e.toString())
    }
})

module.exports = router;