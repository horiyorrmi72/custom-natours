const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name!'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email!'],
            
    },
    photo: {
        type: String,
        default: 'default.jpg',
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: 8,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'Passwords do not match!',
        }
    },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    active: { type: Boolean, default: true, select: false }
    
});

const User = mongoose.model('User', userSchema);
module.exports = User;