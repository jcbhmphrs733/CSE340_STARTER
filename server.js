/* ***********************
* Require Statements
*************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const app = express()
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")



/* ***********************
* Middleware
* ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(require('connect-flash')())
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


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
app.use("/account", require("./routes/accountRoute"))
app.use("/inv", require("./routes/inventoryRoute"))

//Index route 
app.get("/", utilities.handleErrors(baseController.buildHome));
app.get("/error", utilities.handleErrors(baseController.throwError));

//last route 404
app.use(async (req, res, next) => {
  next({ status: 404, message: "Page Not Found" });
});


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
  console.log(`app listening on http://${host}:${port}`)
})


