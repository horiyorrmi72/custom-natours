const mongoose = require('mongoose');
const slugify = require('slugify');
const { diffIndexes } = require('./user.model');
const { Schema } = mongoose;

const tourSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			trim: true,
			maxlength: [50, 'A tour must have less or equal than 50 characters'],
			minlength: [10, 'a tour name must have more or equal than 10 characters'],
		},
		slug: String,
		duration: {
			type: Number,
			required: [true, 'A tour must have a duration'],
		},
		maxGroupSize: {
			type: Number,
			required: [true, 'A tour must have a group size'],
		},
		difficulty: {
			type: String,
			required: [true, 'A tour must have a difficulty'],
			enum: {
				values: ['easy', 'medium', 'difficult'],
				message: 'Difficulty is either: easy, medium, difficult.',
			},
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, 'Ratings must be above 1.0'],
			max: [5, 'Ratings must be below 5.0'],
			set: (val) => Math.round(val * 10) / 10,
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, 'A tour price is required'],
		},

		priceDiscount: {
			type: Number,
			validate: {
				validator: function (value) {
					return value < this.price;
				},
				message: 'Discount price {{VALUE}} must be lower than regular price',
			},
		},
		summary: {
			type: String,
			trim: true,
			required: [true, 'A tour must have a summary'],
		},
		description: {
			type: String,
			trim: true,
		},
		imageCover: {
			type: String,
			required: [true, 'A tour must have a cover image'],
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		startDates: [Date],
		secretTour: {
			type: Boolean,
			default: false,
		},
		startLocation: {
			type: {
				type: String,
				default: 'Point',
				enum: ['Point'],
			},
			coordinates: [Number],
			address: String,
			description: String,
			day: Number,
		},
		locations: [
			{
				type: {
					type: String,
					default: 'Point',
					enum: ['Point'],
				},
				coordinates: [Number],
				address: String,
				description: String,
				day: Number,
			},
		],
		guides: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
	{timestamps: true} //this will be use to track when a new tour is created [added to the list of tours]
);

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true,
        trim: true
    });
    next();
})


const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
