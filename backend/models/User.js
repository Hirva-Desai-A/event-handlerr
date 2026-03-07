const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    otp: String,

    verified: {
        type: Boolean,
        default: false
    },

    registeredEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    ]

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema);