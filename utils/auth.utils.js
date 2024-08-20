const rateLimit = require('express-rate-limit');

/**
 * @class RateLimit
 * @constructor - takes two arguments, `options` and `maxLimit`. 
 * The `options` is the route you want to apply the rate limit to, and `maxLimit` is the maximum number of requests allowed.
 * @param {string} options - The route you want to apply the rate limit to.
 * @param {number} maxLimit - The maximum number of requests allowed per time window.
 * 
 * The class checks for the type of data provided in the constructor arguments and throws an appropriate error message if they don't match the expected data type.
 * 
 * Once the limit is hit, it sends a message to notify the user that the limit has been reached and they should wait for a specified time before trying again.
 * @method getLimiter - This method returns the rate limiter middleware.
 */

class RateLimit {
	constructor(options, maxLimit) {
		if (typeof options !== 'string')
			throw new Error(
				'the option must be of string specifying the endpoints to limit'
			);
		if (typeof maxLimit !== 'number') {
			throw new Error('maxLimit must be a number');
		}

		this._options = options;
		this._maxLimit = maxLimit;
		this.limiter = rateLimit({
			limit: maxLimit,
			statusCode: 429,
			windowMs: 60 * 60 * 1000,
			message: `You have exceeded the maximum limit allowed try again in an hour time.🙏`,
		});
	}
	
    getLimiter() {
        // console.log(this.limiter);
        return this.limiter;
    }
}

module.exports = RateLimit;
