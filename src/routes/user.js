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

        }).populate("fromUserId", ["firstName", "lastName"])
            .populate("toUserId", ["firstName", "lastName"]);

        res.send({
            message: 'Requests fetched successfully',
            data: connectionRequest
        })
    }
    catch (err) {
        res.status(400).send("Details not found");
    }

})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id }
            ],
            status: 'accepted'
        }).populate("fromUserId", ['firstName',"lastName"]);
        const fetchData = connectionRequest.map((item) => {
            if (item.fromUserId.toString() === loggedInUser._id.toString()) {
                return item.fromUserId
            }
            else {
                return item.toUserId
            }
        }
        );

        res.send({
            message: 'Requests Fetched Successfully',
            data: fetchData
        })

    }
    catch (err) {
        res.status(400).send("Failed To Fetched Requests");
    }
})

module.exports = userRouter;