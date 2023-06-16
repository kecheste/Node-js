const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const port = 9999

const app = express()
app.use('/',express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/register', async (req, res) => {
    console.log(req.body);
    res.json({status: 'ok'})
})

app.listen(port, () => {
    console.log(`server up at ${port}`);
})