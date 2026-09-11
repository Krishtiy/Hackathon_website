import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

const CreateTeamForm = () => {
  const [teamName, setTeamName] = useState('');
  const { showModal, login } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName) {
      showModal('Please enter a team name.');
      return;
    }

    try {
      await axios.post('https://hackathon-backend1-akuo.onrender.com/api/teams', { name: teamName });

      // Fetch updated profile
      const { data } = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/auth/profile');
      const token = localStorage.getItem('token');
      login(token, data);

      showModal('Team created successfully!', 'success');

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create team';
      showModal(message);
    }
  };

  return (
    <div className="relative max-w-lg mx-auto p-10 rounded-xl bg-[#001012]/80 backdrop-blur-md 
                    border border-[#00ff7f33] shadow-[0_0_40px_rgba(0,255,127,0.15)]
                    animate-fadeIn overflow-hidden">

      {/* Cyberpunk Grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,255,127,0.15) 1px, transparent 1px), linear-gradient(0deg, rgba(0,255,127,0.15) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0,255,127,0.12) 2px, transparent 2px)",
          backgroundSize: "100% 4px",
        }}
      />

      <div className="relative z-10">

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center
                       bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                       bg-clip-text text-transparent
                       drop-shadow-[0_0_15px_rgba(0,255,127,0.4)] mb-4">
          Create Your Team
        </h2>

        <p className="text-[#9AE6C7] text-center mb-6 leading-relaxed">
          You are not in a team yet. Create a team to get started.  
          You can add up to <span className="text-[#00ff7f] font-semibold">2 more members</span> after creation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Input */}
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter your team name"
            className="
              w-full px-4 py-3 bg-[#020e0c] text-[#bfffe7]
              border border-[#00ff7f40] rounded-md
              placeholder-[#77a69a]
              focus:outline-none focus:ring-2 focus:ring-[#00ff7f]
              transition-all
            "
          />

          {/* Button */}
          <Button
            type="submit"
            className="w-full justify-center text-lg"
          >
            Create Team
          </Button>
        </form>

      </div>
    </div>
  );
};

export default CreateTeamForm;
