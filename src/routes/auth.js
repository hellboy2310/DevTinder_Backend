const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");



authRouter.post("/signup", async (req, res) => {

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
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: passwordHash,
            age: age,
            gender: gender,
            skills: skills,
            photoUrl: photoUrl,
            about: about
        })

        await user.save();
        res.send("User added successfully")
    }
    catch (err) {
        res.status(400).send("Error saving the user" + err.message);
    }

})

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No user found with this email." });
        }

        const isPasswordValid = await user.comparePassword(password);

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

authRouter.post("/logout", (req, res) => {
    res.cookie("cookie", null, {
        expires: new Date(Date.now())
    })
    res.send("User logged out Successfully");
})

module.exports = authRouter;