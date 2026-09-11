import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

const TeamView = () => {
  const { user, login, showModal } = useAppContext();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [teamName, setTeamName] = useState('');

  if (!user) {
    return (
      <p className="text-center text-[#00e5ff] animate-pulse">
        Loading user…
      </p>
    );
  }

  useEffect(() => {
    if (user.teamId) {
      const fetchMyTeam = async () => {
        try {
          const { data } = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/teams/myteam');
          setTeam(data);
        } catch (error) {
          showModal(error.response?.data?.message || 'Could not fetch team details');
        } finally {
          setLoading(false);
        }
      };
      fetchMyTeam();
    } else {
      setLoading(false);
    }
  }, [user, showModal]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName) return showModal("Please enter a team name.");

    try {
      await axios.post('https://hackathon-backend1-akuo.onrender.com/api/teams', { name: teamName });

      const { data } = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/auth/profile');
      const token = localStorage.getItem('token');
      login(token, data);

      showModal('Team created successfully!', 'success');
    } catch (error) {
      showModal(error.response?.data?.message || "Failed to create team");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email) return showModal('Please enter an email.');

    try {
      const { data } = await axios.post(
        `https://hackathon-backend1-akuo.onrender.com/api/teams/${team._id}/members`,
        { email }
      );

      setTeam(data);
      setEmail('');
      showModal('Member added successfully!', 'success');
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to add member');
    }
  };

  // LOADING
  if (loading) {
    return (
      <p className="text-center text-[#00e5ff] animate-pulse">
        Loading team…
      </p>
    );
  }

  // NO TEAM → SHOW CREATE TEAM PANEL
  if (!team) {
    return (
      <div className="max-w-lg mx-auto p-8 rounded-xl
                      bg-[#001012]/80 backdrop-blur-md
                      border border-[#00e5ff44]
                      shadow-[0_0_25px_rgba(0,229,255,0.25)]
                      animate-fadeIn">

        <h2 className="text-4xl font-extrabold mb-4
                       bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                       bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,127,0.4)]
                       text-center">
          Create Your Team
        </h2>

        <p className="text-gray-300 text-center mb-6">
          You can add up to 2 more members after creating your team.
        </p>

        <form onSubmit={handleCreateTeam} className="space-y-5">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team Name"
            className="w-full px-4 py-3 rounded-md bg-[#020e0c]
                       border border-[#00ff7f55] text-[#bfffe7]
                       focus:border-[#00ffcc] focus:ring-[#00ffcc] focus:ring-2
                       placeholder-gray-500"
          />

          <Button type="submit" className="w-full text-lg py-3">
            Create Team
          </Button>
        </form>
      </div>
    );
  }

  // TEAM EXISTS → SHOW TEAM DATA
  const isLeader = user._id === team.leader._id;
  const maxMembers = 3;

  return (
    <div className="space-y-8 animate-fadeIn">

      <h2 className="
        text-4xl font-extrabold mb-2
        bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
        bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,127,0.4)]">
        My Team
      </h2>

      <p className="text-[#00e5ff] text-xl font-semibold">
        {team.name}
      </p>

      <p className="text-sm text-[#9AE6C7]">
        Status: {" "}
        <span className={
          team.paymentStatus === "completed"
            ? "text-[#00ff7f]"
            : "text-yellow-300"
        }>
          {team.paymentStatus === 'completed' ? 'Payment Verified' : 'Pending Payment'}
        </span>
      </p>

      {/* MEMBER LIST */}
      <div className="space-y-4">
        {team.members.map((member) => (
          <div key={member._id}
               className="p-4 rounded-xl bg-[#001012]/80 backdrop-blur-md
                          border border-[#00ff7f44]
                          shadow-[0_0_15px_rgba(0,255,180,0.15)]
                          flex justify-between items-center hover:shadow-[0_0_25px_rgba(0,255,200,0.3)]
                          transition-all duration-300">
            
            <div>
              <p className="text-[#00ffcc] font-semibold text-lg">
                {member.name} {member._id === user._id && "(You)"}
              </p>
              <p className="text-gray-400 text-sm">{member.email}</p>
            </div>

            {member._id === team.leader._id && (
              <span
                className="
                  text-xs font-bold px-3 py-1 rounded-full
                  bg-[#00ff7f33] text-[#00ffae]
                  border border-[#00ff7f66]
                  shadow-[0_0_10px_rgba(0,255,127,0.4)]
                "
              >
                LEADER
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ADD MEMBER */}
      {isLeader && team.members.length < maxMembers && (
        <form onSubmit={handleAddMember} className="flex gap-4 mt-4">

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Invite member by email"
            className="flex-grow px-4 py-3 rounded-md bg-[#020e0c]
                       border border-[#00ff7f55] text-[#bfffe7]
                       focus:border-[#00ffcc] focus:ring-[#00ffcc] focus:ring-2
                       placeholder-gray-500"
          />

          <Button type="submit" className="px-6">
            Invite
          </Button>
        </form>
      )}

      {team.members.length >= maxMembers && (
        <p className="text-gray-300 mt-2">
          Your team is full ({maxMembers}/{maxMembers} members).
        </p>
      )}
    </div>
  );
};

export default TeamView;
