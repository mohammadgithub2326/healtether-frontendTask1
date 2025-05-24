
"use client"
import React, { useState } from 'react';
import {useRouter} from 'next/navigation';
import '@fortawesome/fontawesome-free/css/all.min.css';


const App= () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('userModel');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic 
    console.log(isLoginForm ? 'Login' : 'Register', { email, password });
  };

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  const codeExamples = {
    userModel: `// User model with mongoose
const mongoose = require('mongoose');
const validator = require('validator');

console.log("entered models");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});
console.log("exiting  models");

module.exports = mongoose.model('User', userSchema);
`,
    
    authController: `// Auth Controller
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User.js")

// Register
console.log("entered routes");

router.post('/register', 
  
  body('email').isEmail().withMessage('Enter valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
  async (req, res) => {
    console.log("registration started in routes");
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ email, password: hashedPassword });
      await user.save();

      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.ok.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Login
router.post('/login', 
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
        console.log("login  started in routes");

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
    console.log("exsiting from  routes");

module.exports = router;
`,
    
    reactForm: `//// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
    "use client"
    import React, { useState } from 'react';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    
    
    const App= () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [isSignup, setIsSignup] = useState(false);
      const [emailError, setEmailError] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [errorMessage, setErrorMessage] = useState('');
    
      const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      };
    
      const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (e.target.value && !validateEmail(e.target.value) && !e.target.value.match(/^\d{10}$/)) {
          setEmailError('Please enter a valid email or mobile number');
        } else {
          setEmailError('');
        }
      };
    
      const handlePasswordChange = (e) => {
        setPassword(e.target.value);
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (email && !emailError && password) {
          setIsLoading(true);
          setErrorMessage('');
          
          try {
      const endpoint = isSignup
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";
    
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(data.msg || 'An error occurred');
      }
    
      //  Save token to localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        console.log("Token saved to localStorage");
      }
    
      //  Optional: redirect user or show success
      console.log('Success:', data);
    
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
    
        } else {
          if (!email) {
            setEmailError('Please enter a valid email or mobile number');
          }
        }
      };
    
      const toggleSignup = () => {
        setIsSignup(!isSignup);
        setEmailError('');
        setErrorMessage('');
      };
    
      return (
        <div className="flex bg-white h-screen w-full ">
          {/* Left Panel with Gradient Background */}
          <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center relative bg-gradient-to-br from-[#b3f8ed] to-[#4dd8c7] rounded-r-[60px]">
            <div className="absolute inset-0 bg-[url('https://application&width=800&height=1024&seq=1&orientation=portrait')] bg-cover bg-center opacity-50 rounded-r-[60px]"></div>
            <div className="z-10 flex flex-col items-center text-center px-12">
              <p className="text-gray-800 text-xl mb-4">Welcome to</p>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#0b9e8a] relative mr-2">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-plus text-white text-xl"></i>
                  </div>
                </div>
                <div className="w-12 h-12 bg-[#1a3b5d] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-plus text-white text-xl"></i>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-16">HealTether</h1>
              <p className="text-gray-800 font-medium mb-3">Empower your Practice!</p>
              <p className="text-gray-700 text-sm mb-16 max-w-xs">
                Be assured that we have strong commitment to your data privacy and security
              </p>
              <div className="text-xs text-gray-700">
                <a href="#" className="hover:underline cursor-pointer">Privacy policy</a>
                <span className="mx-1">|</span>
                <a href="#" className="hover:underline cursor-pointer">Terms & Conditions</a>
              </div>
            </div>
          </div>
          {/* Right Panel with Form */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 md:px-16 lg:px-24">
            <div className="w-full max-w-md">
              <div className="flex justify-end mb-8">
                <button
                  onClick={toggleSignup}
                  className="text-[#0b9e8a] hover:text-[#0b7e6a] text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap"
                >
                  {isSignup ? 'Login' : 'Signup'}
                  <i className="fas fa-arrow-right ml-1 text-xs"></i>
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isSignup ? 'Create your account' : 'Join our network of Doctors'}
              </h2>
              <p className="text-gray-600 mb-8">
                {isSignup ? 'Fill in your details to get started' : 'Sign in to get started'}
              </p>
              
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {errorMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400"></i>
                  </div>
                  <label htmlFor="email" className="sr-only">Email or Mobile number</label>
                  <input
                    type="text"
                    id="email"
                    className={w-full pl-10 pr-4 py-3 border {emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b9e8a] text-sm}
                    placeholder="Email or Mobile number"
                    value={email}
                    onChange={handleEmailChange}
                    aria-label="Email or Mobile number"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  {emailError && (
                    <p id="email-error" className="mt-1 text-red-500 text-xs">
                      {emailError}
                    </p>
                  )}
                </div>
    
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b9e8a] text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    aria-label="Password"
                  />
                </div>
    
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#0b9e8a] focus:ring-[#0b9e8a] border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
    
                  <div className="text-sm">
                    <a href="#" className="font-medium text-[#0b9e8a] hover:text-[#0b7e6a]">
                      Forgot password?
                    </a>
                  </div>
                </div>
    
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0b9e8a] text-white px-6 py-3 rounded-md hover:bg-[#0b8e7a] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b9e8a] cursor-pointer !rounded-button whitespace-nowrap flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin mr-2"></i>
                      {isSignup ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    isSignup ? 'Create Account' : 'Sign In'
                  )}
                </button>
              </form>
              {isSignup && (
                <p className="mt-6 text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={toggleSignup}
                    className="text-[#0b9e8a] hover:text-[#0b7e6a] font-medium cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    Login
                  </button>
                </p>
              )}
              {!isSignup && (
                <p className="mt-6 text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={toggleSignup}
                    className="text-[#0b9e8a] hover:text-[#0b7e6a] font-medium cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      );
    };
    
    export default App;
    `
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-green-200 shadow-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <i className="fas fa-lock text-green-600 text-2xl mr-2"></i>
                <span className="text-xl font-bold text-gray-900">healtether Task 1</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="#" className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md font-medium">Home</a>
                <a href="#features" className="text-gray-500 hover:text-green-600 px-3 py-2 rounded-md font-medium">Features</a>
                <a href="#Implementation Summary" className="text-gray-500 hover:text-green-600 px-3 py-2 rounded-md font-medium">Documentation</a>
                <a href="#contact" className="text-gray-500 hover:text-green-600 px-3 py-2 rounded-md font-medium">Contact</a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
                
              <button 
                onClick={() => {setIsLoginForm(true);
                    router.push('/')
                }} 
                className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-md font-medium !rounded-button whitespace-nowrap cursor-pointer"
              >
                Login
              </button>
              <button 
                onClick={() => {setIsLoginForm(false);
                                        router.push('/')

                }
                } 
                className="bg-green-300 text-black px-4 py-2 rounded-md font-medium hover:bg-green-700 !rounded-button whitespace-nowrap cursor-pointer"
              >
                Register
              </button><button 
                onClick={() => window.location.href = 'https://healtether-state-management-task-fronend.vercel.app/'

                } 
                className="bg-green-300 text-black px-4 py-2 rounded-md font-medium hover:bg-green-700 !rounded-button whitespace-nowrap cursor-pointer"
              >
                
              </button>
            </div>
            <div className="flex md:hidden items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-green-600 cursor-pointer"
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="text-gray-900 block px-3 py-2 rounded-md font-medium">Home</a>
              <a href="#features" className="text-gray-500 hover:text-green-600 block px-3 py-2 rounded-md font-medium">Features</a>
              <a href="#" className="text-gray-500 hover:text-green-600 block px-3 py-2 rounded-md font-medium">Documentation</a>
              <a href="#" className="text-gray-500 hover:text-green-600 block px-3 py-2 rounded-md font-medium">Contact</a>
              <a href="#" className="text-gray-500 hover:text-green-600 block px-3 py-2 rounded-md font-medium">Click Me For useState  Managment Task</a>

            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5 space-x-3">
                <button 
                  onClick={() => setIsLoginForm(true)} 
                  className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-md font-medium !rounded-button whitespace-nowrap cursor-pointer"
                >
                  Login
                </button>
                <button 
                  onClick={() => setIsLoginForm(false)} 
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 !rounded-button whitespace-nowrap cursor-pointer"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      {/* <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/loginbg-healtether.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="max-w-7xl mx-auto pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative z-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Secure Authentication Made Simple
              </h1>
              <p className="mt-4 text-xl text-gray-100 max-w-lg">
                A complete authentication solution with Express validation, MongoDB integration, and React hooks for seamless user experience.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="bg-white text-green-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100 !rounded-button whitespace-nowrap cursor-pointer">
                  Get Started
                </button>
                <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:bg-opacity-10 !rounded-button whitespace-nowrap cursor-pointer">
                  View Demo
                </button>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{isLoginForm ? 'Login' : 'Register'}</h2>
                <button 
                  onClick={toggleForm} 
                  className="text-green-200 hover:text-white text-sm font-medium cursor-pointer"
                >
                  {isLoginForm ? 'Need an account?' : 'Already have an account?'}
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-gray-400"></i>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white bg-opacity-20 border-none text-white placeholder-gray-300 block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400"></i>
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white bg-opacity-20 border-none text-white placeholder-gray-300 block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 !rounded-button whitespace-nowrap cursor-pointer"
                >
                  {isLoginForm ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div> */}

      {/* Features Section */}
      <section id="features" className="py-16   bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mt-10 text-gray-900 sm:text-4xl">
              Complete Authentication Solution
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Our stack includes everything you need to implement secure, robust authentication in your applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-shield-alt text-black text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Express Validation</h3>
              <p className="text-gray-600">
                Robust server-side validation using express-validator to ensure data integrity and security for all user inputs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-wpforms text-black text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Form Management</h3>
              <p className="text-gray-600">
                Clean, user-friendly registration and login forms with real-time validation and error handling for better UX.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-database text-black text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">MongoDB Integration</h3>
              <p className="text-gray-600">
                Seamless integration with MongoDB using Mongoose for efficient user data storage and retrieval.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-lock text-black text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Security</h3>
              <p className="text-gray-600">
                Industry-standard password hashing with bcrypt to protect user credentials and prevent security breaches.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-key text-black text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">JWT Authentication</h3>
              <p className="text-gray-600">
                Secure JSON Web Token implementation for stateless authentication and protected API routes.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fab fa-react text-black text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">React Hooks</h3>
              <p className="text-gray-600">
                Modern React implementation using hooks for state management and component lifecycle in a functional paradigm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Summary Section */}
      <section id="Implementation Summary" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Implementation Summary
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              See how we've satisfied all the requirements for a complete authentication system.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requirement
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Implementation Summary
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      Express Validation
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Used express-validator in backend to validate email and password during register/login.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      Forms
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Built Register & Login forms using React functional components with useState, onChange, and onSubmit.
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      MongoDB Integration
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Used mongoose to connect to MongoDB and define User schema.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      bcrypt
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Used for hashing passwords before storing in DB.
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      jsonwebtoken
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Used to generate JWT token on successful login and registration.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      validator
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Used in backend to validate email format and password strength.
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      mongoose
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Defined models and handled DB operations.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      Frontend with React Hooks
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Used useState, useEffect, and fetch to handle input, form submission, and API response.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Code Examples
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              See how easy it is to implement authentication with our solution.
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div className="flex border-b border-gray-700 text-sm">
              <button 
                id="userModelTab"
                onClick={() => setActiveCodeTab('userModel')} 
                className={`px-4 py-2 ${activeCodeTab === 'userModel' ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white'} focus:outline-none cursor-pointer`}
              >
                User Model
              </button>
              <button 
                id="authControllerTab"
                onClick={() => setActiveCodeTab('authController')} 
                className={`px-4 py-2 ${activeCodeTab === 'authController' ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white'} focus:outline-none cursor-pointer`}
              >
                Auth Controller
              </button>
              <button 
                id="reactFormTab"
                onClick={() => setActiveCodeTab('reactForm')} 
                className={`px-4 py-2 ${activeCodeTab === 'reactForm' ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white'} focus:outline-none cursor-pointer`}
              >
                React Form
              </button>
            </div>
            <div className="p-4 text-gray-300 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre">
                {codeExamples[activeCodeTab]}
              </pre>
            </div>
            <div className="flex justify-end p-2 bg-gray-800">
              <button className="text-gray-400 hover:text-white px-3 py-1 rounded text-sm flex items-center focus:outline-none cursor-pointer">
                <i className="far fa-copy mr-1"></i> Copy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to implement secure authentication?
          </h2>
          <p className="mt-4 text-xl text-green-100 max-w-2xl mx-auto">
            Get started with our complete authentication solution and focus on building your application's core features.
          </p>
          <div className="mt-8">
            <button className="bg-white text-green-700 px-8 py-3 rounded-md font-medium hover:bg-gray-100 !rounded-button whitespace-nowrap cursor-pointer">
              Start Building Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <i className="fas fa-lock text-green-400 text-2xl mr-2"></i>
                <span className="text-xl font-bold">AuthStack</span>
              </div>
              <p className="text-gray-400 text-sm">
                A complete authentication solution for modern web applications.
              </p>
              <div className="flex mt-4 space-x-4">
                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm cursor-pointer">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm cursor-pointer">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm cursor-pointer">Examples</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm cursor-pointer">GitHub Repository</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm cursor-pointer">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm cursor-pointer">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm cursor-pointer">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm cursor-pointer">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to our newsletter for the latest updates and features.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-green-500 border-none text-sm"
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 focus:outline-none !rounded-button whitespace-nowrap cursor-pointer">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2025 AuthStack. All rights reserved.</p>
            <div className="flex justify-center mt-4 space-x-6">
              <a href="#" className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white cursor-pointer">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white cursor-pointer">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
