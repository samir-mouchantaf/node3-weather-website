const express = require("express");
const path = require("path");
const hbs = require("hbs");
const { runInNewContext } = require("vm");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const { response } = require("express");

//since express is a function, we are saving it in an app variable to be able to use
const app = express();
const port = process.env.PORT || 3000

// telling the server to listen to port 3000 where we are hosting the server
app.listen(port, () => {
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


// now we will set up SSH and its a secure way for our device to comunicate with github and heroku and transfer the files
// 1- 1s we will run a command on the terminal as follows:
// ssh-keygen -t rsa -b -C "samir.mchantaf@gmail.com"
// so above we are trying to create something called keypairs 
// -t is type
// rsa is a secutiry protocol and its doesnt stand for anything
// -b 4096 means bits and the number after that is the number of bits we specified, 4096 is a standard number and nothing special about it
// -C has to be capital and its just a comment and we ised the email
// 2- after hitting enter, we will be asked some questions...first question press enter...second question about the passphrase, we dont want to enter a passphrase so hit enter and hit enter again
// 3- then do ls -a -l ~/.ssh to check if the new folders are added to the user files
// you will see id_rsa and id_rsa.pub
// 4- the we will make sure to establish the connection when the program runs by doing the following:
// eval $(ssh-agent-s) 
// 5- then we need to register the file:
//ssh-add ~/.ssh/id_rsa

//NOW WE WILL PUSH UP OUR APP TO GIT SERVERS
// 1- get to github.com and login
// 2- i clidked new -> name: node3-weather-website and left all the other options below blank and public
// 3- now we will use the code inside the next page under the push an existing rep.........:
// we will run only the first code that starts with git remote add origin.....
// the code above will not upload the application to github but will open a gate of comunication
// then we have to tell github that we are the ones pushing the code, we do that by:
// going to settings in github -> ssh and gpg keys -> new ssh key -> title: work laptop -> key: (go back to terminal and write cat ~/.ssh/id_rsa.pub, copy the whole result and paste it in the key in github)
// 4- now we will test our connection in github by typing :
// ssh -T git@github.com, then type yes
// 5- then we do the 3rd line of code 'git push -u origin master'
//						------------------------------------------------------------------------------------------------------
// NOW WE WILL PUSH THE CODE TO HEROKU
//because we did open an ssh with github, so not a lot of setup to do...but if you want the details, check angela file on the newsletter
// 1- so all we need to do is heroku keys:add
// 2- heroku create mou-weather-application
// 3- now we have to tell heroku how to tell heroku which file to run just like when we use node and run node app.js, thats what we want herolu to do..
// so we will go to package.json in vs code and under "scripts", delete the testing line in there and type
// "start": "node src/app.js"...heroku is not the only thing that reads that script, actually node can as well...if you write npm run start ...where start is the name of the script
// 4- now the next change has to be insode the app.js file  and change the app.listen(3000, () => {console.log(server running)}), so we will create a new const port = process.env.PORT and used it in the app.listen(port || 3000 ......)
// 5- back to the app.js file BUT THE ONE IN THE PUBLIC/JS FILE and inside the fetch method, inside the url...remove the http://localhost:3000 and keep the weather?address=.....he mentioned that this is the same concept as the template used in the partials file where we put used the routing with only a / 
// 6- now lets get the git status by running git status
// 7- git add .
// 8- git commit -m "setup app for heroku"
// 9- git push