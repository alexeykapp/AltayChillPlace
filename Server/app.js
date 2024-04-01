require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const model = require('./models/models')
const PORT = process.env.PORT || 5000
const cors = require('cors')
const app = express()

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    }
    catch (err) {
        console.log(err)
    }
}

start();