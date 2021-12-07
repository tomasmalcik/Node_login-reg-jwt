const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validate = require("./validation/validate")
const User = require("../models/User")
const Role = require("../models/Role")
const issueJWT = require("../public/js/issueJWT")
const Workspace = require("../models/Workspace")

const authUser = (req, res, next) => {

    if (req.cookies.token) {
        const token = req.cookies.token
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.redirect("/")
            }

            req.user = user;
            next();
        });
    } else {
        res.redirect("/")
    }

}


router.get("/workspaces", authUser, (req, res) => {
    res.render("app/workspaces.ejs")
})

router.get("/api/workspaces", authUser, async (req, res) => {
    //get workspaces where user is author
    try {
        const find = await Workspace.find({author: req.user.sub})
        return res.json({
            status: 'success',
            data: find,
            uid: req.user.sub
        })
    }catch(err) {

    }
})

router.post("/api/workspaces", authUser, async (req, res) => {
    //validate later
    try {

        const newWorkspace = new Workspace(req.body)

        const saved = await newWorkspace.save()

        res.json({
            status: "success",
            data: saved
        })

    }catch(err) {
        res.json({
            status: "error",
            error: err
        })
    }
})

module.exports = router