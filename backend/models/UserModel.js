const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    requestReset: {
        type: Boolean,
        default: false
    },
    trips: {
        type: Array
    }
})

module.exports = User = mongoose.model('user', UserSchema);