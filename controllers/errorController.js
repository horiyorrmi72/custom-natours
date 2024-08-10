const AppError = require('../utils/appError');

const handleError = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
	});
};

module.exports = handleError;
