require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4040;
const routes = require('./routes');
const app = express();
const db = require('./config/db');
const handleError = require('./controllers/errorController');
const version = 'v1';
const environment = process.env.NODE_ENV;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1', routes);

app.get('/', async (req, res) => {
	res.status(200).json({
		sucess: true,
		data: 'welcome to our custom tour server side',
	});
});
app.use(handleError);

db;
app.listen(port, () => {
	environment.match('development')
		? console.log(
				`Server listening 👂 and running 🏃 👣 on port: ${port} and you're in dev-mode 👨‍💻 💻`
		  )
		: console.log(`Server listening 👂 and running 🏃 👣 on port: ${port}`);
});
