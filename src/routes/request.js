const express = require("express");

const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");


requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const userName = req.user;
        res.send({
            message: userName.firstName + "send you a follow request"
        })
    }
    catch (err) {
        res.status(400).send("Err:" + err.message);
    }

})

module.exports = requestRouter;