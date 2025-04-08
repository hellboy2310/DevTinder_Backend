const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;


    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is weak")
    }
}

const validateEditProfileData = (req) => {
    const isEditAllowed = ["firstName", "lastName", "email", "photoUrl", "about", "skills"];

    const isValid = Object.keys(req.body).every(field => isEditAllowed.includes(field))
    return isValid;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}