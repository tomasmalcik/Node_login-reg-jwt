const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean
    }
})

const listSchema = new mongoose.Schema({
    //Title, items
    title: {
        type: String,
        required: true
    },
    items: [itemSchema]
})

const workspaceSchema = mongoose.Schema({
    title: {
        type: String,
        min: 3,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: {
        type: String,
        required: false
    },
    lists: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ToDoList'
        }],
        required: false,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Workspace', workspaceSchema)