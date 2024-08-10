const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { getOne, getAll, updateOne, deleteOne } = require('./handlerFactory');

/**
 * @param {*} obj the object to process
 * @param  {...any} passData list of data to be accepted others will be ignored.
 * @returns the new object created.
 */
const filterObj = async (obj, ...passData) => {
	const newObj = {};
	Object.keys(obj).forEach((key) => {
		if (passData.includes(key)) {
			newObj[key] = obj[key];
		}
	});
	return newObj;
};

const getUserById = getOne(User);
const getUsers = getAll(User, 'users');
const updateUserData = updateOne(User, 'user');
const userUpdateProfile = catchAsync(async (req, res) => {
	const user = req.params.id;
	const newData = req.body;
	if (req.body.password || req.body.confirmPasword) {
		return next(
			new AppError(
				'Make use of the change password page to change your password from the dashboard',
				400
			)
		);
	}
	const filter = filterObj(newData, 'name', 'email');
	if (req.file) {
		filter.photo = req.file.filename;
	}
	const updatedUserData = await User.findByIdAndUpdate(user, filter, {
		new: true,
		runValidators: true,
	});
	return res.status(200).json({
		success: true,
		message: 'Successfully updated user data!😀',
		data: {
			data: updateUserData,
		},
	});
});

const deleteUser = deleteOne(User);
const deleteUsers = catchAsync(async (req, res, next) => {
	const { id } = req.body;
	if (!id || !Array.isArray(id) || id.length === 0) {
		return next(new AppError('Could not find list of users to delete', 404));
	}
	const usersToDelete = await User.find({ _id: { $in: id } });
	if (usersToDelete.length === 0) {
		return next(
			new AppError('users with the given data to delete were not found!', 404)
		);
	}

	await User.deleteMany(usersToDelete);
	return res
		.status(209)
		.json({ success: true, message: 'Users deleted successfully!' });
});

module.exports = {
	getUserById,
	getUsers,
	updateUserData,
	deleteUser,
	deleteUsers,
};
