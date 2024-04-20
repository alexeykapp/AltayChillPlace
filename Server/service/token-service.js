const jwt = require('jsonwebtoken')
const { authentication, client } = require('../models/models')
const { where } = require('sequelize')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_KEY, { expiresIn: '1m' })
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
        const tokenData = await authentication.destroy({ where: { token: refreshToken } })
        return tokenData;
    }
    async findToken(refreshToken) {
        const tokenData = await authentication.findOne({ where: { token: refreshToken } })
        return tokenData;
    }
    async findClientToken(refreshToken) {
        const tokenData = await authentication.findOne({ where: { token: refreshToken } })
        if (!tokenData) {
            return null;
        }
        const user = await client.findOne({ where: { id_client: tokenData.fk_client } })
        return user;
    }
    validateAccessToken(token) {
        try {
            const resultValidation = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            return resultValidation;
        }
        catch (err) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const resultValidation = jwt.verify(token, process.env.SECRET_REFRESH_KEY);
            return resultValidation;
        }
        catch (err) {
            return null;
        }
    }
}

module.exports = new TokenService();