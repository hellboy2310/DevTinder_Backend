const express = require('express');
const { connectDb } = require('./config/db')
const app = express();
const User = require("./models/user");

app.use(express.json()); // to handle JSON
app.use(express.urlencoded({ extended: true })); // to handle form data


app.post("/signup", async (req, res) => {

    //creating a new instance of user model
    const user = new User(req.body)
    try {
        await user.save();
        res.send("User added successfully")
    }
    catch (err) {
        res.status(400).send("Error saving the user", err.message);
    }

})

connectDb().then(() => {
    console.log('Database Connection Successfull!!');
    app.listen(3000, () => {
        console.log('🚀 Server is running on port 3000');
    });

}).catch(() => {
    console.log('Unsuccessfull Database Connection');
})


