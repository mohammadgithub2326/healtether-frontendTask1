// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
"use client"
import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';


const App= () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router=useRouter();
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

  // ✅ Save token to localStorage
  if (data.token) {
    localStorage.setItem("authToken", data.token);
    console.log("Token saved to localStorage");
  }
  
  // ✅ Optional: redirect user or show success
  console.log('Success:', data);
  const token = data.token;
   token?router.push("homepage"):router.push("/")

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
        <div className="absolute inset-0 bg-[url('/loginbg.jpg')] bg-cover bg-center opacity-50 rounded-r-[60px]"></div>
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
                className={`w-full pl-10 pr-4 py-3 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b9e8a] text-sm`}
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

              {/* <div className="text-sm">
                <a href="#" className="font-medium text-[#0b9e8a] hover:text-[#0b7e6a]">
                  Forgot password?
                </a>
              </div> */}
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
