const express = require('express')
require('../database/connection')

const port = process.env.PORT || 3000
const app = express()

const v1Router = require('../routers/v1')

app.use(express.json())
app.use('/v1', v1Router)

// Handler for 404 - Not Found
app.use((req, res, next) => {
    const error = new Error("We think you are lost");
    error.status = 404
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        status: err.status,
        message: err.message,
    })
})


app.listen(port, () => {
    console.log('Server started at port: ' + port)
})


// const myFunction = () => {
    

//     var isVerified = jwt.verify(token, 'mysampleapplicationonnode')
//     console.log(isVerified._id)
// }

// myFunction()