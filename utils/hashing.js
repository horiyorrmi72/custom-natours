const bcrypt = require('bcrypt');
const AppError = require('./appError');
const catchAsync = require('./catchAsync');


const hashData = async (data,salt=12) => {
	const hash = await bcrypt.hash(data, salt);
	console.log(hash);
	return hash;
};

const compareData = async (providedData, hashedData) => {
	const comparer = await bcrypt.compare(providedData, hashedData);
	return comparer;
};

module.exports = {
	hashData,
	compareData,
};
