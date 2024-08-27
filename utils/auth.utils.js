const { rateLimit } = require('express-rate-limit');

const limitTrials = (maxRequests) => {
	const windowMs = 1 * 60 * 60 * 1000;
	return rateLimit({
		windowMs,
		limit: maxRequests,
		message: `you have reached the limit for your request please try again in ${
			windowMs / (60 * 60 * 1000)
		} hour(s).`,
	});
};

module.exports = limitTrials;
