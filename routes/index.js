const router = require("express").Router()
const verifyToken = require("../private/js/verifyToken")
const User = require("../models/User")
router.get("/", (req, res) => {
    res.render("index.ejs", {
        user: new User()
    })
})

router.get("/private", verifyToken, (req, res) => {
    res.send("Private")
})

module.exports = router