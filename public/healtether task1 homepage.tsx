// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('userModel');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log(isLoginForm ? 'Login' : 'Register', { email, password });
  };

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  const codeExamples = {
    userModel: `// User model with mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);`,
    
    authController: `// Auth Controller
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Register a new user
exports.register = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      email,
      password
    });

    // Save user to database (password will be hashed by pre-save hook)
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.login = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};`,
    
    reactForm: `// React Login/Register Form Component
import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(endpoint, formData);
      
      // Store token in localStorage
      localStorage.setItem('token', res.data.token);
      
      // Set auth header for future requests
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      // Redirect or update state as needed
      console.log('Authentication successful');
      
    } catch (err) {
      setError(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : 'An error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:underline focus:outline-none"
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;`
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <i className="fas fa-lock text-indigo-600 text-2xl mr-2"></i>
                <span className="text-xl font-bold text-gray-900">AuthStack</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="#" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Home</a>
                <a href="#features" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Features</a>
                <a href="#" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Documentation</a>
                <a href="#" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Contact</a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setIsLoginForm(true)} 
                className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md font-medium !rounded-button whitespace-nowrap cursor-pointer"
              >
                Login
              </button>
              <button 
                onClick={() => setIsLoginForm(false)} 
                className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
              >
                Register
              </button>
            </div>
            <div className="flex md:hidden items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-indigo-600 cursor-pointer"
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
              <a href="#features" className="text-gray-500 hover:text-indigo-600 block px-3 py-2 rounded-md font-medium">Features</a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 block px-3 py-2 rounded-md font-medium">Documentation</a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 block px-3 py-2 rounded-md font-medium">Contact</a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5 space-x-3">
                <button 
                  onClick={() => setIsLoginForm(true)} 
                  className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md font-medium !rounded-button whitespace-nowrap cursor-pointer"
                >
                  Login
                </button>
                <button 
                  onClick={() => setIsLoginForm(false)} 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://readdy.ai/api/search-image?query=Modern%20abstract%20tech%20background%20with%20gradient%20blue%20and%20purple%20colors%2C%20subtle%20geometric%20patterns%2C%20digital%20technology%20concept%20with%20soft%20light%20effects%20and%20flowing%20shapes%2C%20minimalist%20design%20perfect%20for%20authentication%20platform%20hero%20section&width=1440&height=600&seq=hero1&orientation=landscape" 
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
                <button className="bg-white text-indigo-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100 !rounded-button whitespace-nowrap cursor-pointer">
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
                  className="text-indigo-200 hover:text-white text-sm font-medium cursor-pointer"
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
                      className="bg-white bg-opacity-20 border-none text-white placeholder-gray-300 block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
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
                      className="bg-white bg-opacity-20 border-none text-white placeholder-gray-300 block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 !rounded-button whitespace-nowrap cursor-pointer"
                >
                  {isLoginForm ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Complete Authentication Solution
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Our stack includes everything you need to implement secure, robust authentication in your applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-shield-alt text-indigo-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Express Validation</h3>
              <p className="text-gray-600">
                Robust server-side validation using express-validator to ensure data integrity and security for all user inputs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-wpforms text-indigo-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Form Management</h3>
              <p className="text-gray-600">
                Clean, user-friendly registration and login forms with real-time validation and error handling for better UX.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-database text-indigo-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">MongoDB Integration</h3>
              <p className="text-gray-600">
                Seamless integration with MongoDB using Mongoose for efficient user data storage and retrieval.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-lock text-indigo-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Security</h3>
              <p className="text-gray-600">
                Industry-standard password hashing with bcrypt to protect user credentials and prevent security breaches.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-key text-indigo-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">JWT Authentication</h3>
              <p className="text-gray-600">
                Secure JSON Web Token implementation for stateless authentication and protected API routes.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fab fa-react text-indigo-600 text-xl"></i>
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
      <section className="py-16 bg-gray-50">
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
      <section className="py-16 bg-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to implement secure authentication?
          </h2>
          <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto">
            Get started with our complete authentication solution and focus on building your application's core features.
          </p>
          <div className="mt-8">
            <button className="bg-white text-indigo-700 px-8 py-3 rounded-md font-medium hover:bg-gray-100 !rounded-button whitespace-nowrap cursor-pointer">
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
                <i className="fas fa-lock text-indigo-400 text-2xl mr-2"></i>
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
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 border-none text-sm"
                />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none !rounded-button whitespace-nowrap cursor-pointer">
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
