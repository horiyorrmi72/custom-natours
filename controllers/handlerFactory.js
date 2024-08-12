const catchAsync = require('../utils/catchAsync.utils');
const AppError = require('../utils/appError.utils');
const { Model } = require('mongoose');

/**
 * helper function to create a document
 * @param {Model} -  model to use for the creation of the document.
 * @returns - status code 200 of success an the document.
 */
const createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const document = await Model.create(req.body);

		console.log(document);

		res.status(201).json({
			success: true,
			status: 'success',
			msg: 'successfully created',
			data: { document },
		});
	});

/**
 *
 * @param {Model} - the model to query
 * @param {queryName} - a name for the query you're running this can be use in the message sent in the response e.g. trying to get a 'user' the queryName can be `user` by default it is set to user.
 * @returns
 */
const getOne = (Model, queryName = 'user') =>
	catchAsync(async (req, res, next) => {
		const { id } = req.params;
		const document = await Model.findById(id);

		if (!document) {
			return next(new AppError(`No ${queryName} found with that ID`, 404));
		}

		res.status(200).json({
			status: 'success',
			data: {
				document,
			},
		});
	});

const getAll = (Model, queryName) =>
	catchAsync(async (req, res, next) => {
		const documents = await Model.find().exec();
		res.status(200).json({
			status: 'success',
			message: `${queryName} Data fetched successfully!`,
			results: documents.length,
			data: {
				data: documents,
			},
		});
	});

const updateOne = (Model, queryName) =>
	catchAsync(async (req, res, next) => {
		const filter = req.params.id;
		const newData = req.body;
		const document = await Model.findByIdAndUpdate(filter, newData, {
			new: true,
			runValidators: true,
		});
		if (!document) {
			return next(new AppError(`No ${queryName} with the given ID found!`));
		}
		console.log(document);
		return res.status(200).json({
			success: true,
			message: `Data updated successfully`,
			data: {
				data: document,
			},
		});
	});

const deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const document = await Model.findByIdAndDelete(req.params.id);
		if (!document) {
			return next(new AppError("Couldn't find the data to delete.", 404));
		}
		return res
			.status(209)
			.json({ success: true, message: 'data deleted successfully' });
	});
module.exports = {
	createOne,
	getOne,
	getAll,
	updateOne,
	deleteOne,
};
