const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validate = require("./validation/validate")
const User = require("../models/User")
const Role = require("../models/Role")
const issueJWT = require("../public/js/issueJWT")
const Workspace = require("../models/Workspace")
const ToDoList = require("../models/ToDoList")
const mongoose = require("mongoose")

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

const checkExistence = async (req, res, next) => {
    try {
        //Get list
        const list = await ToDoList.findById(req.params.id)

        if(!list) {
            return res.json({
                status: 'error',
                error: 'Ran into error while processing.. try again later'
            })
        }
        req.list = list
        next()
    }catch(err) {
        return res.json({
            status: 'error',
            error: 'Ran into error while processing.. try again later'           
        })
    }
}

const checkPermission = async (req, res, next) => { //For deleting workspace and list
    //User already added to req, list already added to req
    try {
        //Get workspaces where user is author
        const userWorkspace = await Workspace.find({"lists": new mongoose.mongo.ObjectId(req.params.id), author: req.user.sub})
        //Try to find if list is present in workspaces and author is logged user
        if(!userWorkspace) {
            return res.json({
                status: 'error',
                error: 'You are not the owner of workspace'
            })
        }
        next()
    }catch(err) {
        return res.json({
            status: 'error',
            error: 'Ran into error.. try again later'
        })
    }
}

//@TODO Finish
router.put("/api/todolists/:id", async (req, res) => {
    //@TODO validate
    
    //@TODO check if exists
    
    //Already validated and exists
    try {

        //const newList = req.body
        const list = await ToDoList.findById(req.params.id)
        list.items = req.body.items
        console.log(list)
        const updated = await list.save()

        if(!updated) {
            res.send("Erroris")
        }

        res.send("Oukk")
    }catch(err) {
        res.send(`Tak erroris: ${err}`)
    }
})

router.delete("/api/todolists/:id", authUser, checkExistence, checkPermission, (req, res) => {
    res.send(req.list)
})

module.exports = router


