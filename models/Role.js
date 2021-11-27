const { number } = require("joi")
const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    power: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Role', roleSchema)