const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require("../models/connectionRequest");

userRouter.get('/user/request/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'

        }).populate("fromUserId", ["firstName", "lastName"]);

        res.send({
            message: 'Requests fetched successfully',
            data: connectionRequest
        })
    }
    catch (err) {
        res.status(400).send("Details not found");
    }

})

module.exports = userRouter;