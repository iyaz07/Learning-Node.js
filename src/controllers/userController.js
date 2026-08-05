import { userModel } from "../models/userModels.js";
import { signupValidate } from "../validator/uservalidator.js";
import { loginValidate } from "../validator/uservalidator.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";


export const getHome = (req, res) => {
   res.send("Homepage!")
}


export const getUser = (req, res) => {
   res.send("User!")
}


export const getAbout = (req, res) => {
   console.log(req.url, req.method)
   res.send("Aboutpage!")
}


export const postUser = async (req, res) => {
   try {
      const { username, email, password } = req.body
      const { error } = signupValidate.validate({
         username,
         email,
         password,
      });
      if (error) {
         return res.status(400).json({ message: error.details[0].message })
      }
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ mesage: 'User already exists' })
      }
      const newUser = await userModel.create({
         username,
         email,
         password
      })

      const token = generateToken(newUser._id)
      res.cookie('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'lax',
         maxAge: 1000 * 60 * 60 * 24 * 7
      })

      const refinedUser = {
         username: newUser.username,
         email: newUser.email,
      }
      return res.status(201).json({
         message: "Usercreated",
         data: refinedUser
      })
   }
   catch (error) {
      console.error(error)
      throw new Error("Something went wrong")
   }
};


export const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body
      const { error } = loginValidate.validate({ email, password });
      if (error) {
         return res.status(400).json({ message: error.details[0].message })
      }
      const existingUser = await userModel.findOne({ email });
      if (!existingUser) {
         return res.status(404).json({ mesage: 'User not found, Signup Instead' })
      }
      const validPassword = bcrypt.compare(password, existingUser.password);
      if (!validPassword) {
         return res.status(401).json({ mesage: 'Invalid password' })
      }
      const refinedUser = {
         username: existingUser.username,
         email: existingUser.email,
      }
      return res.status(200).json({ message: "login successfully", data: refinedUser });
   }
   catch (error) {
      console.error(error)
      throw new Error("Something went wrong")
   }
};
