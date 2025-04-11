const express = require('express');
const { connectDb } = require('./config/db')
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");

app.use(express.json()); // to handle JSON
app.use(express.urlencoded({ extended: true })); // to handle form data

app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


connectDb().then(() => {
    console.log('Database Connection Successfull!!');
    app.listen(3000, () => {
        console.log('🚀 Server is running on port 3000');
    });

}).catch(() => {
    console.log('Unsuccessfull Database Connection');
})


