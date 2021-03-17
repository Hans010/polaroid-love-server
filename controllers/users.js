import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import User from '../models/user.js';

export const signIn = async (req, res) => {
    const {email, password} = req.body;

    try {
        // check if user exists in database
        const existingUser = await User.findOne({email});
        if (!existingUser) return res.status(404).json({message: "User doesnt exist"});

        // check if password match
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});

        // Login successful - Create token
        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.SECRET_TOKEN, {expiresIn: "1h"});
        res.status(200).json({result: existingUser, token});
    } catch (err) {
        res.status(500).json({message: 'Something went wrong', error: err})
    }
}

export const signUp = async (req, res) => {
    const {email, password, confirmPassword, firstName, lastName} = req.body;

    try {
    // check if user exists in database
    const existingUser = await User.findOne({email});
    if (existingUser) return res.status(400).json({message: "User already exist"});

    // Check if passwords match
    if (password !== confirmPassword) return res.status(400).json({message: "Passwords don't match"});
    const hashedPassword = await bcrypt.hash(password, 12);

    // new user created - Create token
    const result = await User.create({email, password: hashedPassword, name: `${firstName} ${lastName}`})
    const token = jwt.sign({email: result.email, id: result._id}, process.env.SECRET_TOKEN, {expiresIn: "1h"});
    res.status(200).json({result, token});
} catch (err) {
        res.status(500).json({message: 'Something went wrong', error: err})
    }
}