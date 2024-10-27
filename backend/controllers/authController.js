  // authController.js

import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';
import { auth } from '../config/firebase-config.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import admin from '../config/firebase-admin.js';

dotenv.config(); // Load environment variables

// Firebase authentication for students
export const studentLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const idToken = await user.getIdToken();
    console.log('succesful login student');
    // Return user info or generate a token as needed
    res.status(200).json({ uid: user.uid, email: user.email, idToken, rollNo: user.rollNo });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
    console.log('fail login student');
  }
};

// Fixed email/password authentication for warden and security
export const wardenOrSecurityLogin = async (req, res) => {
  const { email, password } = req.body;
    try{
      const adminCredential = await signInWithEmailAndPassword(auth,email,password);
      const user = adminCredential.user;
      const idToken = await user.getIdToken();
      return res.status(200).json({ uid: user.uid, email: user.email, role: user.role, idToken});
    } catch (error) {
      return res.status(500).json({message: 'Error generating token', error: error.message});
    }
};

export const createStudent = async(req,res) => {
  const {email,password,rollNo} = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth,email,password);
    const user = userCredential.user;

    const newUser = new User({
      email: email,
      firebaseUID: user.uid,
      role: 'student',
      rollNo: rollNo,
    });

    await newUser.save();
    res.status(201).json({message: 'Student created successfully', uid: user.uid});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export const createAdmin = async(req,res) => {
  const {email,password,role} = req.body;
  try {
    const adminCredential = await createUserWithEmailAndPassword(auth,email,password);
    const user = adminCredential.user;

    const newUser = new User({
      email: email,
      firebaseUID: user.uid,
      role: role,
    });

    await newUser.save();
    res.status(201).json({message: 'Admin created succesfully', uid: user.uid});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}