const router = require("express").Router()
const verifyToken = require("../private/js/verifyToken")

router.get("/", (req, res) => {
    res.render("index.ejs")
})

router.get("/private", verifyToken, (req, res) => {
    res.send("Private")
})

module.exports = router