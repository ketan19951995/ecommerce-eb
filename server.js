const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const db = require("./app/config/db");
const app = express();

mongoose.connect(db.url, {
  useNewUrlParser: "true",
})

mongoose.connection.on("error", err => {
  console.log("err", err)
})

mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
})

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

const userRoutes =  require("./app/routes/user");
app.use('/user', userRoutes)

const productRoutes =  require("./app/routes/product");
app.use('/product', productRoutes)


const PORT = 3000
app.listen(PORT, () => {
  console.log(`app is listening to PORT ${PORT}`)
})

