//How to code in react to show email and password prompts. If no email and password were setup previously then it will popup a new user// 
//setup information page which will require prompt for the user to type email, password, confirm password, and a submit button. After user//
 //is logged in, it will send you to mainGame.jsx file with the user information like email, password and all other saved information goes//
// with user to the game. Also if the password is not typed correctly by the validated user, it will take that user to another page where// 
// the user will provide his or her email information so that, if that email exists in the Mongo Database, then that user will receive a 
// password reset link in his or her email. Clicking on that reset link in the email will take the user to another login screen where the// 
//user will get a prompt to type the new password and then retype it again to confirm the new password is accepted. Using the new password//
//  will allow the user to login successfully which will take the user straight to the mainGames.jsx file to show the main Game screen. 

//1. Setting up the React App//

npx create-react-app react-auth-flow
cd react-auth-flow
npm install react-router-dom axios

//2. Setting up React Router In src/App.js, set up your routes://

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import UserSetupPage from './UserSetupPage';
import PasswordResetPage from './PasswordResetPage';
import MainGame from './MainGame';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/setup" element={<UserSetupPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="/game" element={<MainGame />} />
      </Routes>
    </Router>
  );
}

export default App;

//3. LoginPage Component //(LoginPage.js)//
//This is the login page where users enter their email and password. If no user is found or the password is incorrect, //
//it will redirect to the password reset page.//

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.success) {
        navigate('/game', { state: { email, password } });
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => navigate('/reset-password')}>Forgot Password</button>
    </div>
  );
}

export default LoginPage;

//4. UserSetupPage Component (UserSetupPage.js)//
//This is where new users can set up their email and password.//

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserSetupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSetup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post('/api/signup', { email, password });
      if (response.data.success) {
        navigate('/game', { state: { email, password } });
      } else {
        alert('Error during signup');
      }
    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Confirm Password" 
        value={confirmPassword} 
        onChange={(e) => setConfirmPassword(e.target.value)} 
      />
      <button onClick={handleSetup}>Create Account</button>
    </div>
  );
}

export default UserSetupPage;

//5. PasswordResetPage Component (PasswordResetPage.js)//
//This page will allow the user to enter their email to request a password reset.//

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    try {
      const response = await axios.post('/api/request-password-reset', { email });
      if (response.data.success) {
        alert('Password reset link sent to your email!');
        navigate('/');
      } else {
        alert('Email not found');
      }
    } catch (error) {
      alert('Error during password reset');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <button onClick={handlePasswordReset}>Send Reset Link</button>
    </div>
  );
}

export default PasswordResetPage;

//6. MainGame Component (MainGame.jsx)//
//Once the user is logged in, this component displays the game screen.

import React from 'react';
import { useLocation } from 'react-router-dom';

function MainGame() {
  const location = useLocation();
  const { email, password } = location.state || {};

  return (
    <div>
      <h1>Welcome to the Game</h1>
      <p>User Email: {email}</p>
      <p>User Password: {password}</p>
      {/* Game content here */}
    </div>
  );
}

export default MainGame;

//7. Backend (Node.js/Express)//
//Set up an Express.js server with MongoDB for handling authentication, signup, and password reset. Here's a simplified //
//example of how to handle these actions.//

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('./models/User'); // Mongoose model for user

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/react-auth-flow', { useNewUrlParser: true, useUnifiedTopology: true });

// Signup
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();
  res.json({ success: true });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false });

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Request password reset
app.post('/api/request-password-reset', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false });

  // Send password reset email using nodemailer
  const transporter = nodemailer.createTransport({ /* transporter config */ });
  const resetToken = jwt.sign({ email }, 'secret', { expiresIn: '1h' });
  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
  
  await transporter.sendMail({
    to: email,
    subject: 'Password Reset',
    text: `Click the link to reset your password: ${resetLink}`,
  });

  res.json({ success: true });
});

// Reset password
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, 'secret');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email: decoded.email }, { password: hashedPassword });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});

app.listen(5000, () => console.log('Server is running on port 5000'));
