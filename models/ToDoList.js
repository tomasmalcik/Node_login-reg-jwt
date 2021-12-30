const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    }
}, { _id : false })

const listSchema = new mongoose.Schema({
    //Title, items
    title: {
        type: String,
        required: true
    },
    items: [itemSchema]
})

module.exports = mongoose.model('ToDoList', listSchema)