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

//get one user using emailId
// app.get("/user", async (req, res) => {
//     const email = req.body.email;
//     console.log(email, 'email coming');

//     try {
//         const userDetails = await User.find({ email: email });
//         if (userDetails.length === 0) {
//             res.status(404).send('User not found')
//         }
//         else {
//             res.send(userDetails)

//         }
//     }
//     catch (err) {
//         res.status(400).send("error finding the details", err.message)
//     }
// })


//get user using findOne

app.get("/user", async (req, res) => {
    const email = req.body.email;
    try {
        const userDetails = await User.findOne({email: email});
        if(userDetails.length === 0){
            res.status(400).send("User not found");
        }
        else{
            res.send(userDetails);I
        }
    }
    catch (err) {
        res.status(400).send("error finding the details", err.message);
    }
})

//get all user which are there in the documents
app.get("/feed", async (req, res) => {
    try {
        const allUser = await User.find({});
        res.send(allUser);
    }
    catch (err) {
        res.status(400).send("Users not found", err.message);
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


