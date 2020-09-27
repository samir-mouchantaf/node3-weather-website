const express = require("express");
const path = require("path");
const hbs = require("hbs");
const { runInNewContext } = require("vm");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const { response } = require("express");

//since express is a function, we are saving it in an app variable to be able to use
const app = express();

// telling the server to listen to port 3000 where we are hosting the server
app.listen(3000, () => {
	console.log("App running on port 3000");
});

// tell express to use hbs as a template application
app.set("view engine", "hbs");

// setting the path directories
const publicPath = path.join(__dirname, "../public"); // for the css and js to be used by express
const viewsPath = path.join(__dirname, "../templates/views"); // this is where my templates will be for the index, about, help and 404.hbs

// telling express where the views directory will be
app.set("views", viewsPath);

// telling express where are the directories to use for css and js
app.use(express.static(publicPath));

//setting up the partials directory for hbs to use
const partialsPath = path.join(__dirname, "../templates/partials");

// registiring hbs to use the partials path
hbs.registerPartials(partialsPath);

// setup our routes

//index route
app.get("", (req, res) => {
	res.render("index", {
		title: "Weather",
		name: "Samir el mouchantaf",
	});
});

// about route
app.get("/about", (req, res) => {
	res.render("about", {
		title: "About me",
		name: "Samir el mouchantaf",
		img: "img/mypic.jpg",
	});
});

//help route
app.get("/help", (req, res) => {
	res.render("help", {
		title: "Help Page",
		name: "Samir el mouchantaf",
		message: "For help, please contact us",
	});
});

//weather route
app.get("/weather", (req, res) => {
	if (!req.query.address) { //req.query is where the inpiut data is stored, if i add address so it will look for the value stored in the key "address"
		return res.send({ // returning the error message, using return will also stop the code from continuing to the next line
			Error: "Please enter a city in the search field",
		});
	}

	// if no error, this code will run
	// calling geocode using the req.query.address which is the input 
	geocode(req.query.address, (error, data) => { 
		if (error) {
			return res.send({
				Error: error,
			});
		}


		forecast(data.long, data.lat, (error, forecastdata) => {
			if (error) {
				return res.send({
					Error: error,
				});
			}
			res.send({
				location: data.location,
				forecast: forecastdata,
			});
		});
	});
});

//404 routes
app.get("*", (req, res) => {
	res.render("404", {
		title: "404 Page",
		message: "Page not found",
		name: "Samir el mouchantaf",
	});
});

//to host with heroku...
// 1- heroku login

// git setup
// 1- git init
// 2- git status ....this will get you the status of your code, the code or files go through 4 stages...untracked, unstaged, stages and commit....1st is the untracked and this is the files that never were comitted before, unstaged are the files that has been comiited before and then edited after the 1st commit but not commited again, staged are the file that are ready to be commited...commit are the files that has been commited

// 3- Note that you dont want git to track the node_modules since its a generated drectory, u can always do npm instal to get the file again...thats why we will create a new file in the root directory called .gitignore and write inside it the folders we want git to ignore such node_modules/ 

// 4- git add . 	must include the . to add all files
// git commit -m ......this will commit all staged files and must add a message