const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env._EMAIL,
		pass: process.env._EMAIL_APP_PASS,
	},
});

transporter.verify((error, success) => {
	if (error) {
		console.error('Error verifying connection:', error);
	} else {
		console.log('Ready for sending messages:', success);
	}
});


class Email {
	constructor(user, resetToken) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.from = `horla from custom natours <${process.env._EMAIL}>`;
		this.transporter = transporter;
		this.resetToken = resetToken;
	}

	async send(template, subject) {
		const html = pug.renderFile(
			`${__dirname}/../views/emails/pug/${template}.pug`,
			{
				firstName: this.firstName,
				resetToken:this.resetToken,
				subject,
			}
		);

		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: convert(html, {
				wordwrap: false,
			}),
		};
		await this.transporter.sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to the custom natours Family! 🤗');
	}

	async sendPasswordReset() {
		await this.send(
			'passwordReset',
			'Reset password instructions for your custom Natours account!'
		);
	}
}

module.exports = Email;
