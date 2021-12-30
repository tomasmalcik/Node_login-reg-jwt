const mongoose = require("mongoose")
module.exports = async () => {
    return await mongoose.createConnection(process.env.DB_URL, { useNewUrlParser: true }, () => {
        console.log("Connected to DB")
    })
}