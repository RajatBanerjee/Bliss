// set up ======================================================================
var express = require("express");
var exphbs = require("express-handlebars");
var app = express();
var path = require("path");

var port = process.env.PORT || 3000; // set the port
var morgan = require("morgan");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var router = require("./src/server/routes");

app.use("/resources/", express.static(path.join(__dirname + "/resources/"))); // set the static files location /public/img will be /img for users
app.use(morgan("dev")); // log every request to the console
app.use(bodyParser.urlencoded({
	"extended": "true"
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(methodOverride("X-HTTP-Method-Override")); // override with the X-HTTP-Method-Override header in the request
app.engine("handlebars", exphbs({
	defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use("/",router);
// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);