const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send({
            message: user
        })
    }
    catch (err) {
        res.status(400).send("Err:" + err);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const isValid = validateEditProfileData(req);
        if (!isValid) {
            throw new Error("User is Invalid");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save()
        res.send('profile udpated successfully');
    }
    catch (err) {
        res.status(400).send("Unable to edit profile " + err.message)
    }
})

module.exports = profileRouter;