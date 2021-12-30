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
    avatar: {
        type: Buffer,
        required: true
    },
    avatarType: {
        type: String,
        required: true
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.virtual('avatarPath').get(function() {
    if(this.avatar != null && this.avatarType != null) {
        return `data:${this.avatarType};charset=utf8;base64,${this.avatar.toString('base64')}`
    }
})

module.exports = mongoose.model('User', userSchema)