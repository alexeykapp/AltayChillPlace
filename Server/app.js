require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const model = require('./models/models')
const PORT = process.env.PORT || 5000
const router = require('./routes/index')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middleware/error-middleware')

const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use(cookieParser())
app.use(errorMiddleware)

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