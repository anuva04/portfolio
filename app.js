// create an express app
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();
// const publicDirectoryPath = path.join(__dirname, '/public');

// View Engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

// use the express-static middleware
app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use(express.static(publicDirectoryPath));

// define the first route
app.get('/', (req, res) => {
  res.render('index', { layout:false });
});

//post route
app.post('/send', (req, res) => {
	const output = `
	<p>You have a new Email</p>
	<h3>Contact details</h3>
	<ul>
		<li>Name: ${req.body.name}</li>
		<li>Email: ${req.body.email}</li>
		<li>Subject: ${req.body.subject}</li>
	</ul>
	<h3>Message</h3>
	<p>${req.body.message}</p>
	`;

		//create reusable transporter object
	let transporter = nodemailer.createTransport({
		// 
		service: 'gmail',
		type: "SMTP",
		host: "smtp.gmail.com",
		secure: true,
		auth: {
			user: 'rinibhatt9@gmail.com', // generated ethereal user
			pass: 'Apurba1Pranati2' // generated ethereal password
		}
	});

	//setup email data with unicode symbols
	let mailOptions = {
		from: '"Nodemmailer contact" <rinibhatt9@gmail.com>', // sender address
		to: "rinibhatt9@gmail.com", // list of receivers
		subject: "New Contact", // Subject line
		text: "You have a new Email", // plain text body
		html: output // html body
	};

	//send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if(error){
			return console.log(error);
		}
		console.log('Message sent : %s', info.messageId);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		res.render('index', {layout:false});
	});
});

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));