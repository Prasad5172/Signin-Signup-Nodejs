const mongoose = require("mongoose")

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DATA_BASE}`)
mongoose.connection.on("connected" ,() => console.log("connected succesfully"))
mongoose.connection.on("error", (e) => console.log("connection failed with -",e))