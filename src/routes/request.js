const express = require("express");

const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const fromUserId = req.user._id;

        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            throw new Error("status is not allowed")
        }
        console.log(fromUserId, 'myUserId');

        //checking if this user even exists in DB
        const toUserIdExists = await User.findById(toUserId);

        if (toUserId === fromUserId) {
            throw new Error("You cannot request yourself");
        }

        if (!toUserIdExists) {
            throw new Error("User does not Exists");
        }

        const existingConnectionRequest = ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (existingConnectionRequest) {
            throw new Error("Request Already Exists");
        }
        const connectionRequest = new ConnectionRequestModel({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        });

        const data = await connectionRequest.save();

        res.json({
            message: status,
            data
        })
    }
    catch (err) {
        res.status(400).send("Err:" + err.message);
    }

})

module.exports = requestRouter;