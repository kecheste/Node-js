const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const port = 9999
const mongoose = require('mongoose')
const User = require('./model/user')

mongoose.connect('mongodb://localhost:27017/login-app-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true

})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/register', async (req, res) => {
    console.log(req.body)

    res.json({status: 'ok'})
})

app.listen(port, ()  => {
    console.log(`server up at ${port}`);
})