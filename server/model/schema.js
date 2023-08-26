import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserAuthLogin = new mongoose.Schema({
    github: {
        id: { type: String, unique: true },
        username: { type: String },
        githubtoken: { type: String },
    },
    google: {
        id: { type: String, unique: true },
        username: { type: String },
        googletoken: { type: String },
        picture: { type: String }
    },
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minlength: 2,
        maxlength: 16
    },
    email: {
        type: String,
        required: [true, 'Email is requrired.'],
        minlength: 4,
        maxlength: 40,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid Email'
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        minlength: 3
    }
    // poulate the other schema here and add a ref to the module.
});

/**
 * Save the user's credentionals from the JWT auth methods. 
*/

UserSchema.pre('save', async function() {

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(this.password, salt);
    this.password = hashedPassword;
});

UserSchema.methods.createJWT = function () {

    const payload = {
        user: { 
            id: this._id,
            user: this.name
        }
    }
    
    return jwt.sign(payload, process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_LIFETIME
    });
}

UserSchema.methods.comparePassword = async function (candatespassword) {

    const isMatch = await bcryptjs.compare(candatespassword, this.password);
    return isMatch;
}

const SchemaAuthUser = mongoose.model('UserAuth', UserAuthLogin);
const SchemaUser = mongoose.model('User', UserSchema);

export {
    SchemaUser,
    SchemaAuthUser,
};