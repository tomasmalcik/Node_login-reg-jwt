const jwt = require("jsonwebtoken")
const path = require("path")
const fs = require("fs")

const pathToKey = path.join(__dirname, '..', '..', 'id_rsa_priv.pem')
const priv_key = fs.readFileSync(pathToKey, 'utf8')

async function issueJWT(user) {
    const _id = user._id

    const expiresIn = "1d"

    const payload = {
        sub: _id,
        iat: Date.now()
    }

    const signedToken = jwt.sign(payload, process.env.TOKEN_SECRET)

    return {
        token: signedToken,
        expires: expiresIn
    }
}

module.exports.issueJWT = issueJWT