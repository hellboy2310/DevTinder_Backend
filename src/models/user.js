const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 4,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password" + value);
            }
        }
    },
    age: {
        type: Number,
        trim: true,
        min: 18
    },
    gender: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!['male' | 'female' | 'others']) {
                throw new Error("Enter a valid gender")
            }
        }
    },
    photoUrl: {
        type: String,
        default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pnrao.com%2F%3Fattachment_id%3D8917&psig=AOvVaw2ehJDJPGUcuKUUfClypi4D&ust=1744023645770000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPiwusKgw4wDFQAAAAAdAAAAABAG'
    },
    about: {
        type: String,
        default: 'This is a default description'
    },
    skills: {
        type: [String],
        validate: {
            validator: function (v) {
                return v.length >= 2 && v.length <= 6;
            },
            message: 'Skills array must have between 2 and 6 items.'
        }
    }
}, { timestamps: true })

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, "Hellboy008", {
        expiresIn: '7d'
    });

    return token;

}

userSchema.methods.comparePassword = async function(passwordInputByUser) {
    const user = this;
    const isPasswordvalid = bcrypt.compare(passwordInputByUser, user.password);
    if(!isPasswordvalid){
        throw new Error("Invalid Password")
    }
    return isPasswordvalid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;