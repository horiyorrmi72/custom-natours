const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { hashData } = require('../utils/hashing');
const { Schema } = mongoose;

const userSchema = new Schema(
	{
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
			minlength: [8, 'Password must be at least 8 characters.'],
			select: false,
		},
		confirmPassword: {
			type: String,
			required: [true, 'Please confirm your password.'],
			validate: {
				// This only works on CREATE and SAVE!
				validator: function (value) {
					return value === this.password;
				},
				message: 'Passwords do not match!',
			},
		},
		createdAt: { type: Date },
		passwordChangedAt: { type: Date },
		passwordResetToken: { type: String },
		passwordResetExpires: { type: Date },
		active: { type: Boolean, default: true, select: false },
	},
	{ timestamps: true }
);

// middleware to handle password hashing and remove confirmPassword
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await hashData(this.password, 12);
	// Delete confirmPassword field
	this.confirmPassword = undefined;
	next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
