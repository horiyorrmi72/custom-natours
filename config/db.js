require('dotenv').config();
const mongoose = require('mongoose');
const db_uri = process.env.DB_URI;

module.exports = mongoose
	.connect(db_uri,{
		dbName: 'custom-natours'
	})
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((err) => {
		console.error('Failed to connect to MongoDB', err);
	});


