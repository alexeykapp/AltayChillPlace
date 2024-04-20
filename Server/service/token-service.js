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
    async saveToken(userId, refreshToken) {
        try {
            const tokenData = await authentication.findOne({ where: { fk_client: userId } })
            if (tokenData) {
                tokenData.token = refreshToken;
                return tokenData.save();
            }
            const token = await authentication.create({ fk_client: userId, token: refreshToken })
            return token;
        }
        catch (err) {
            console.log("Token saving error")
        }
    }
    async removeToken(refreshToken) {
        const tokenData = await authentication.deleteOne({ refreshToken })
        return tokenData;
    }
}

module.exports = new TokenService();