const jwt = require('jsonwebtoken')
const { authentication } = require('../models/models')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_KEY, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }
}