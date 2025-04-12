const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequestModel = require("../models/connectionRequest");

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills email';

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
        }).populate("fromUserId", ['firstName', "lastName"]);
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


userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const loggedInuser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        //firstly trying to find all the connections request 
        const connectionRequest = await ConnectionRequestModel.find({
            $or: [{ fromUserId: loggedInuser._id }, { toUserId: loggedInuser._id }],
        }).select("fromUserId toUserId")

        //by hiding users we will be able to get the new users
        const hideUsersFromFeed = new Set();

        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });


        console.log(hideUsersFromFeed);
        //now we are looking for all those use who are not the connected user by any means 
        const users = await User.find({
            $and: [
                {
                    _id: { $nin: Array.from(hideUsersFromFeed) },
                },
                {
                    _id: { $ne: loggedInuser._id}
                }

            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        console.log(users, 'users');

        res.send(users);
    }
    catch (err) {
        throw new Error("Err" + err.message);
    }
})

module.exports = userRouter;