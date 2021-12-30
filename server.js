if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
mongoose.Promise = global.Promise;
const bodyParser = require("body-parser")
const path = require("path")
const passport = require("passport")
var cookieParser = require('cookie-parser')

//Require passport config
require("./config/passport")(passport)

//Routes
const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")
const workspacesRouter = require("./routes/workspaces")
const todolistsRouter = require("./routes/todolists")

//app sets
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", __dirname + "/views/layouts/layout")
app.set('trust proxy', 1);

//app uses
app.use ((req, res, next) => {
    res.locals.url = req.originalUrl;
    res.locals.host = req.get('host');
    res.locals.protocol = req.protocol;
    next();
});
app.use(expressLayouts)
app.use(express.static("private"))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
app.use(passport.initialize())



//Connect to db
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => {
    console.log("Connected to DB")
})

//Routes middleware
app.use(indexRouter)
app.use(usersRouter)
app.use(workspacesRouter)
app.use(todolistsRouter)

//Listen on port 3000 on dev or some port in production
app.listen(process.env.PORT || 3000)
