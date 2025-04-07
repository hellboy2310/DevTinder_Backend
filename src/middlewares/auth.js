const jwt = require('jsonwebtoken');
const User = require("../models/user");

const adminAuth = (req, res, next) => {
    const token = 'xyz';
    if (token !== 'xyz') {
        res.send({
            message: "Unauthorized user"
        })
    }
    else {
        next();
    }
}

const userAuth = async (req, res, next) => {

    try {
        const { cookie } = req.cookies;

        if (!cookie) {
            throw new Error("Invalid Token");
        }

        const decodedMessage = jwt.verify(cookie, "Hellboy008")
        const { _id } = decodedMessage;

        //find user of this id
        const user = await User.findById({ _id: _id }).exec();
        if (!user) {
            throw new Error('User not found');
        }
        req.user = user;
        next()

    }
    catch (err) {
        res.status(400).send("Err" + err.message);
    }

}
module.exports = {
    adminAuth,
    userAuth
}

