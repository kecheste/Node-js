const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const port = 9999
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')

const JWT_SECRET = 'sdfnjskj@!@7gs8dgsg4242g24g2g424grgrg47sd6gs8d76f'

mongoose.connect('mongodb://127.0.0.1/login-app-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/change-password',(req, res) => {
    const { token } = req.body
    const user = jwt.verify(token, JWT_SECRET)

    console.log(user)
    res.json({status: 'ok'})

})
app.post('/api/login',async (req, res) => {

    const {username, password} = req.body

    const user = await User.findOne({username}).lean()

    if(!user) {
        return res.json({status: 'error', error: 'Invalid username/password'})
    }

    if(await bcrypt.compare(password, user.password)) {
        // the username, password combination is successful
        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, JWT_SECRET)

        return res.json({status: 'ok', data: token})
    }

    res.json({status: 'error', error: 'Invalid username/password'})
})

app.post('/api/register', async (req, res) => {

    const { username, password: plainTextPassword } = req.body
    if (!username || typeof username !== 'string') {
        return res.json({status: 'error'})
    }

    const password = await bcrypt.hash(plainTextPassword, 10)

    if(!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({status:'error',error:'Invalid password'})
    }

    if(plainTextPassword.length < 5) {
        return res.json({status:'error',error:'Password too small'})
    }

    try {
        const response = await User.create({
            username,
            password
        })
        console.log('user created: ', response)
    } catch(err) {
        if(err.code === 11000) {
            // duplicate key
            return res.json({status: 'error',error:'Username already in use'})
        }
        return res.json({status: 'error'})
    }

    res.json({status: 'ok'})
})

app.listen(port, ()  => {
    console.log(`server up at ${port}`);
})