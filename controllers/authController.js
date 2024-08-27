const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync.utils');
const AppError = require('../utils/appError.utils');
const Email = require('../utils/email.utils');
const {
	compareData,
	generateResetToken,
	hashData,
} = require('../utils/hashing');
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
	const existingUser = await User.findOne({ email: email });
	if (existingUser) {
		return next(new AppError('User already exists', 400));
	}
	const createUser = factory.createOne(User)(req, res, next);
	const newUser = {
		name: req.body.name,
		email: req.body.email,
	};
	sendWelcomeEmail(newUser);
});

const sendWelcomeEmail = async (user) => {
	try {
		await new Email(user).sendWelcome();
	} catch (error) {
		console.log('Error sending welcome email:', error);
	}
};

const signin = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError('Invalid email or password', 400));
	}
	const user = await User.findOne({ email: email }).select('+password');
	if (!user) {
		return next(
			new AppError('Invalid email or password! Not a valid user 😆', 404)
		);
	}
	const isPasswordMatch = await compareData(password, user.password);
	if (!isPasswordMatch) {
		return next(new AppError('Invalid user password!', 400));
	}
	if (!user) {
		return next(
			new AppError(`Are you sure you're registered on this account?`, 400)
		);
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
			token: token,
		},
	});
});

const forgotPassword = catchAsync(async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email: email });
	if (!user) {
		return next(new AppError(`Not sure you're a registered user`, 400));
	}
	const resetToken = generateResetToken();
	const hashResetToken = await hashData(resetToken, 12);
	await User.updateOne(
		{ _id: user._id },
		{
			passwordResetToken: hashResetToken,
			passwordResetExpires: Date.now() + 10 * 60 * 1000,
		}
	);
	//send reset token to user email
	try {
		await sendPasswordResetTokenToMail(user, resetToken);
		res
			.status(200)
			.json({ success: true, message: 'Reset token sent to user email' });
	} catch (error) {
		await User.updateOne(
			{ _id: user._id },
			{
				passwordResetToken: undefined,
				passwordResetExpires: undefined,
			}
		);
		next(new AppError('Error sending email. Please try again later.', 500));
	}
});
const sendPasswordResetTokenToMail = async (user, resetToken) => {
	try {
		await new Email(user, resetToken).sendPasswordReset();
	} catch (error) {
		console.error('Error Sending Reset OTP:', error.message);
	}
};

module.exports = {
	signup,
	signin,
	forgotPassword,
};
