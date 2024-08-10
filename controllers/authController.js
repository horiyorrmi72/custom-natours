const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { compareData } = require('../utils/hashing');
const factory = require('./handlerFactory');
const tokenExpirationTime = 10 * 60 * 24; //4hours

const signToken = (id) => {
	const token = jwt.sign({ id }, 'secret', {
		expiresIn: tokenExpirationTime,
	});
	return token;
};


const signup = catchAsync(async (req, res, next) => {
	const { name, email, password, confirmPassword } = req.body;
	if (!name || !email || !password || !confirmPassword) {
		return next(new AppError('Ensure you fill in all the required data', 400));
	}
	if (confirmPassword !== password) {
		return next(new AppError('Password do not match', 400));
	}
	const createUser = factory.createOne(User);
	createUser(req, res, next);
});

const signin = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError('Invalid email or password', 400));
	}
	const user = await User.findOne({ email: email }).select('+password');
	const isPasswordMatch = await compareData(password, user.password);
	if (!isPasswordMatch) {
		return next(new AppError('Invalid user password!', 400));
	}
	if (!user)
	{
		return next(new AppError(`Are you sure you're registered on this account?`, 400));
	}
	const token = signToken(user._id);
	// console.log('Token: ' + token);

	res.status(200).json({
		success: true,
		message: 'Login Successfully',
		data: {
			name: user.name,
			email: user.email,
			role: user.role,
			token:token,
		},
	});
});

module.exports = {
	signup,
	signin,
};
