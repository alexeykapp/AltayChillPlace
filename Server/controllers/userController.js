const { client } = require('../models/models')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

function generateToken(id, phone) {
    const token = jwt.sign({ id, phone },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
    return token
}
class UserController {
    async registration(req, res) {
        try {
            const { phone, password } = req.body
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors })
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const candidate = await client.findOne({ where: { phone_number_client: phone } })
            if (candidate) {
                return res.status(400).json({ message: "Пользователь с таким логином существует" })
            }
            const Client = await client.create({ phone_number_client: phone, password_client: hashPassword })
            const token = jwt.sign({ id: client.id_client, phone },
                process.env.SECRET_KEY,
                { expiresIn: '24h' }
            )
            return res.json({ token })
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ message: 'Registration error' })
        }
    }

    async login(req, res) {

    }

    async auth(req, res) {
        res.send({ message: "Authenticated" })
    }

    async create(req, res) {
        const { full_name_client, date_of_birth_client, phone_number_client, mail_client, password_client, photo_avatar } = req.body;
        const Сlient = await client.create({ full_name_client, date_of_birth_client, phone_number_client, mail_client, password_client, photo_avatar });
        return res.json(Сlient)
    }
}

module.exports = new UserController()