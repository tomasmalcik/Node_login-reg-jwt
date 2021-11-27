if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")

//Routes
const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")

//app sets
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", __dirname + "/views/layouts/layout")

//app uses
app.use(expressLayouts)
app.use(express.static("public"))
app.use(express.json())


//Connect to db
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => {
    console.log("Connected to DB")
})

//Routes middleware
app.use(indexRouter)
app.use(usersRouter)

app.listen(3000)