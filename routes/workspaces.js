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
//validation
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

const validateList = (req, res, next) => {
    //@TODO - create validation
    next()
}

const validateWorkspace = (req, res, next) => {
    const {error} = validate.workspaceValidation({title: req.body.title})
    if(error) {
        return res.json({
            status: 'error',
            error: error.details[0].message
        })
    }
    //Check if ID is of objectID type
    if(!mongoose.isValidObjectId(req.body.author))
        return res.json({
            status: 'error',
            error: 'Ran into error, try relogging..'
        })
    next()
}

const checkPermission = async (req, res, next) => {
    //find Workspace
    const workspace = await Workspace.findById(req.params.id)
    if(!workspace) {
        return res.json({
            status: "error",
            error: "This workspace does not exist"
        })
    }
    //Check if user is owner of workspace
    if( workspace.author.equals(req.user.sub) ) {
        req.workspace = workspace
        next()
    }else {
        return res.json({
            status: "error",
            error: "You do not have permission for this action"
        })
    }
    //next()
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

router.post("/api/workspaces", authUser, validateWorkspace, async (req, res) => {
    try {

        const newWorkspace = new Workspace(req.body)
        const saved = await newWorkspace.save()

        res.json({
            status: "success",
            data: "Workspace successfully added"
        })

    }catch(err) {
        res.json({
            status: "error",
            error: err.message
        })
    }
})

router.put("/api/workspaces/:id/addList",authUser, validateList, async (req, res) => {
  
    try {

        const newList = new ToDoList(req.body)
        const savedList = await newList.save()  //Try saving list

        if(!savedList) {
            return res.json({
                status: "error",
                error: "Ran into error while saving.. Try again later."
            })
        }

        //Update workspace
        const updatedWorkspace = await Workspace.findByIdAndUpdate({_id: req.params.id},
            {
                $push: {lists: savedList._id}
            })
        if(!updatedWorkspace) {
            removeList(savedList)
            return res.json({
                status: "error",
                error: "Ran into error while saving.. Try again later."
            })
        }

        return res.json({
            status: "success",
            data: savedList
        })

    }catch(err) {
        res.json({
            status: "error",
            error: `Ran into error. Please try again later`
        })
    }
})

//Delete workspace @TODO - try catch
router.delete("/api/workspaces/:id", authUser, checkPermission, async (req, res) => {
    //Delete all lists saved in workspace
    for(const list_id of req.workspace.lists) {
        let list = await ToDoList.findById(list_id)
        if(list) {
            await list.remove()
        }
    }
    const result = await req.workspace.remove()
    if(result) {
        return res.json({
            status: "success",
            data: "Workspace successfully deleted"
        })
    }
    res.json({
        status: "error",
        data: "Could not delete workspace"
    })
})

//Export JSON
router.get("/api/workspaces/:id/export", authUser, checkPermission, async (req, res) => {
    try {
        let expor = await Workspace.findById(req.params.id, '-_id -createdAt -__v -author').populate('lists').exec()
        return res.json({
            status: "success",
            data: expor
        })
    }catch(err) {
        return res.json({
            status: "error",
            error: `Error: ${err.message}`
        })
    }
})


async function removeList(list) {
    //Check if list is really not present in any workspace
    const workspace = Workspace.find({"lists": list._id})
    if(workspace)
        return //If list is present in some workspace, then return
    
    //Remove list, that is not present in any subarray
    list.remove()
}

module.exports = router