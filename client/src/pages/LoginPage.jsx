import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import axios from 'axios';

const LoginPage = () => {
  const { login, showModal } = useAppContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showModal('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(
        'https://hackathon-backend1-akuo.onrender.com/api/auth/login',
        { email, password }
      );

      const { token, ...userData } = response.data;
      login(token, userData);

      if (userData.role === 'admin') navigate('/admin');
      else navigate('/dashboard');

    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      showModal(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,255,127,0.12) 1px, transparent 1px), linear-gradient(0deg, rgba(0,255,127,0.12) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0,255,127,0.1) 2px, transparent 2px)",
          backgroundSize: "100% 4px",
        }}
      />

      <div className="max-w-md w-full space-y-8 relative z-10 bg-[#001012]/80 p-10 rounded-xl border border-[#00ff7f33] shadow-[0_0_35px_rgba(0,255,127,0.15)] backdrop-blur-md">
        
        {/* Title */}
        <h2 className="text-center text-3xl font-extrabold bg-gradient-to-r from-[#00ff7f] to-[#00e5ff] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,127,0.4)]">
          Sign In
        </h2>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          
          {/* EMAIL */}
          <div>
            <label htmlFor="email-address" className="sr-only">Email</label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-3 py-3 bg-[#020e0c] text-[#a8dfcf] border border-[#00ff7f40]
                rounded-md placeholder-[#77a69a]
                focus:outline-none focus:ring-2 focus:ring-[#00ff7f] focus:border-[#00ff7f]
                transition-all
              "
              placeholder="Email Address"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full px-3 py-3 bg-[#020e0c] text-[#a8dfcf] border border-[#00ff7f40]
                rounded-md placeholder-[#77a69a]
                focus:outline-none focus:ring-2 focus:ring-[#00ff7f] focus:border-[#00ff7f]
                transition-all
              "
              placeholder="Password"
            />
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            className="w-full justify-center text-lg"
          >
            Sign In
          </Button>
        </form>

        {/* LINK */}
        <div className="text-center text-sm">
          <Link
            to="/register"
            className="text-[#00e5ff] hover:text-[#00ff7f] transition-all"
          >
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
