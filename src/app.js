const express = require('express');
const { connectDb } = require('./config/db')
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");

app.use(express.json()); // to handle JSON
app.use(express.urlencoded({ extended: true })); // to handle form data
const { validateSignUpData } = require('./utils/validation');
app.use(cookieParser());

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');


app.post("/signup", async (req, res) => {

    //creating a new instance of user model
    try {
        validateSignUpData(req);
        const {
            firstName,
            lastName,
            email,
            password,
            age,
            gender,
            skills,
            photoUrl,
            about
        } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            age,
            gender,
            skills,
            photoUrl,
            about
        })

        await user.save();
        res.send("User added successfully")
    }
    catch (err) {
        res.status(400).send("Error saving the user" + err.message);
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

// app.get("/user", async (req, res) => {
//     const email = req.body.email;
//     try {
//         const userDetails = await User.findOne({email: email});
//         if(userDetails.length === 0){
//             res.status(400).send("User not found");
//         }
//         else{
//             res.send(userDetails);I
//         }
//     }
//     catch (err) {
//         res.status(400).send("error finding the details", err.message);
//     }
// })

//login api
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No user found with this email." });
        }

        const isPasswordValid = await user.isPasswordvalid(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password." });
        }
        const token = await user.getJWT();
        res.cookie('cookie', token);
        res.status(200).json({ message: "Welcome User!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong.", error: err.message });
    }
});

app.get("/profile", userAuth, async (req, res) => {
    const user = req.user;

    res.send({
        message: user
    })
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const userName = req.user;
    res.send({
        message: userName.firstName + "send you a follow request"
    })
})



//get user by userid
app.get("/user", async (req, res) => {
    const id = req.body.id;
    try {
        const userDetail = await User.findById({ _id: id }).exec();
        if (userDetail.length === 0) {
            res.status(400).send("User not found");
        }
        else {
            res.send(userDetail);
        }
    }
    catch (err) {
        res.status(400).send('error finding the details');
    }
})


app.put("/user/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id, 'id aau chu')
    const options = req.body;


    try {

        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", 'age', 'skills'];
        const isupdateAllowed = Object.keys(options).every((k) => ALLOWED_UPDATES.includes(k));
        console.log(isupdateAllowed, 'ahiua')
        if (!isupdateAllowed) {
            throw new Error('update not allowed')
        }
        const updatedUserDetail = await User.findByIdAndUpdate(id, options, { new: true, runValidators: true });
        res.status(200).send({ updatedUserDetail });
    }
    catch (err) {
        res.status(400).send('Failed to update user  ' + err.message);
    }
})

app.delete("/user/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.status(200).send(deleteUser)
    }
    catch (err) {
        res.status(400).send(`failed to delete user`);
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


