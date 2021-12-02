const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    //Name, Email, Role, Password, CreatedAt
    name: {
        type: String,
        required: true,
        min: 6,
        max: 100
    },
    surname: {
        type: String,
        required: true,
        min: 6,
        max: 100       
    },
    email: {
        type: String,
        required: true,
        min: 15,
        max: 256
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Role'
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)