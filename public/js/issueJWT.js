const jwt = require("jsonwebtoken")
const path = require("path")

async function issueJWT(user) {
    const _id = user._id

    const expiresIn = "1d"

    const payload = {
        sub: _id,
        iat: Date.now(),
        honza: "smrdi"
    }

    const signedToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: expiresIn
    })

    return {
        token: signedToken,
        expires: expiresIn
    }
}

module.exports.issueJWT = issueJWT