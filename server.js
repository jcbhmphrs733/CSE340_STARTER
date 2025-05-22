/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const utilities = require("./utilities")
const app = express()
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
// const env = require("dotenv").config()
// const static = require("./routes/static")


/***********************
  * View Engine and Templates
  *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout")
app.use(express.static("public"))


/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))

//Index route 
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute)
app.get("/help", (req, res) => {res.render("index", {title: "Home"})});
app.get("/custom", (req, res) => {res.render("index", {title: "Home"})});
//last route 404
app.use(async (req, res, next) => {
  next({ status: 404, message: "Page Not Found" });
});


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST



/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})


