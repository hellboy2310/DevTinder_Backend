const express = require("express");

const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res, next) => {
    try {

        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const fromUserId = req.user._id;

        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            throw new Error("status is not allowed");
        }

        if (toUserId === fromUserId.toString()) {
            throw new Error("You cannot request yourself");
        }

        const toUserIdExists = await User.findById(toUserId);
        if (!toUserIdExists) {
            throw new Error("User does not Exist");
        }

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            throw new Error("Request Already Exists");
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        });

        console.log(connectionRequest, 'here is it')

        const data = await connectionRequest.save();
        res.status(201).json({ message: status, data });
        

    } catch (err) {
        console.error("Caught error:", err.message);
        // Optionally use next(err) here if using global error middleware
        res.status(400).json({ error: err.message });
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["ignored", "accepted"];

    if (!allowedStatus.includes(status)) {
        throw new Error("Status not allowed");
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested"
    })

    if (!connectionRequest) {
        throw new Error("Connection Request does not exists");
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({
        message: 'Request accepted',
        data
    })

})

module.exports = requestRouter;