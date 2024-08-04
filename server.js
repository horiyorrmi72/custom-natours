require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4040;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', async (req, res) => {
	res.status(200).json({
		sucess: true,
		data: 'welcome to our custom tour server side',
	});
});

const environment = process.env.NODE_ENV;

app.listen(port, () => {
	environment.match('development')
		? console.log(
				`listening 👂 and running 🏃 👣 on port: ${port} and you're in dev-mode 👨‍💻 💻`
		  )
		: console.log(`listening 👂 and running 🏃 👣 on port: ${port}`);
});
