import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import axios from 'axios';

const RegisterPage = () => {
  const { showModal } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, college, phone, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      showModal("Passwords do not match.");
      return;
    }

    if (!name || !email || !college || !phone || !password) {
      showModal("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(
        'https://hackathon-backend1-akuo.onrender.com/api/auth/register',
        { name, email, college, phone, password }
      );

      showModal("Registration successful! Please log in.", "success");
      navigate('/login');

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
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
            "linear-gradient(90deg, rgba(0,255,127,0.14) 1px, transparent 1px), linear-gradient(0deg, rgba(0,255,127,0.14) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0,255,127,0.14) 2px, transparent 2px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Main Card */}
      <div className="relative z-10 max-w-md w-full p-10 rounded-xl 
                      bg-[#001012]/80 backdrop-blur-md
                      border border-[#00ff7f33]
                      shadow-[0_0_40px_rgba(0,255,127,0.15)]">

        <h2 className="text-center text-3xl font-extrabold
                       bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                       bg-clip-text text-transparent
                       drop-shadow-[0_0_18px_rgba(0,255,127,0.4)]">
          Create Your Account
        </h2>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-3 bg-[#020e0c] text-[#a8dfcf]
                       border border-[#00ff7f40] rounded-md
                       placeholder-[#77a69a]
                       focus:outline-none focus:ring-2 focus:ring-[#00ff7f]"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-3 bg-[#020e0c] text-[#a8dfcf]
                       border border-[#00ff7f40] rounded-md
                       placeholder-[#77a69a]
                       focus:outline-none focus:ring-2 focus:ring-[#00ff7f]"
          />

          <input
            name="college"
            type="text"
            placeholder="College / Institution Name"
            required
            value={formData.college}
            onChange={handleChange}
            className="w-full px-3 py-3 bg-[#020e0c] text-[#a8dfcf]
                       border border-[#00ff7f40] rounded-md
                       placeholder-[#77a69a]
                       focus:outline-none focus:ring-2 focus:ring-[#00ff7f]"
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-3 bg-[#020e0c] text-[#a8dfcf]
                       border border-[#00ff7f40] rounded-md
                       placeholder-[#77a69a]
                       focus:outline-none focus:ring-2 focus:ring-[#00ff7f]"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-3 bg-[#020e0c] text-[#a8dfcf]
                       border border-[#00ff7f40] rounded-md
                       placeholder-[#77a69a]
                       focus:outline-none focus:ring-2 focus:ring-[#00ff7f]"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-3 bg-[#020e0c] text-[#a8dfcf]
                       border border-[#00ff7f40] rounded-md
                       placeholder-[#77a69a]
                       focus:outline-none focus:ring-2 focus:ring-[#00ff7f]"
          />

          <Button type="submit" className="w-full justify-center text-lg">
            Register
          </Button>
        </form>

        <div className="text-center text-sm mt-4">
          <Link
            to="/login"
            className="text-[#00e5ff] hover:text-[#00ff7f] transition-all"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
