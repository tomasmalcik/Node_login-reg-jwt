const router = require("express").Router()
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const validate = require("./validation/validate")

router.get("/register", (req, res) => {
    res.render("users/register.ejs")
})

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})


router.post("/register", (req, res) => {
    const { error } = validate.registerValidation(req.body)
    if (error)
        return res.status(400).send(error.details[0].message)

    res.send(req.body)
})
module.exports = router