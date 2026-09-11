import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

const TeamDetails = () => {
  const { user, showModal } = useAppContext();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
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
  }, [showModal]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email) {
      showModal('Please enter an email.');
      return;
    }
    
    try {
      const { data } = await axios.post(
        `https://hackathon-backend1-akuo.onrender.com
/api/teams/${team._id}/members`,
        { email }
      );

      setTeam(data);
      setEmail('');
      showModal('Member added successfully!', 'success');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add member';
      showModal(message);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-[#00e5ff] animate-pulse mt-10">
        Loading your team…
      </p>
    );
  }

  if (!team) {
    return (
      <p className="text-center text-red-400 mt-10">
        Error: Could not load your team.
      </p>
    );
  }

  const isLeader = user._id === team.leader._id;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* LEFT SIDE — TEAM MEMBERS */}
      <div className="md:col-span-2">

        <h2 className="text-4xl font-extrabold mb-4
                       bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                       bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,127,0.45)]">
          {team.name}
        </h2>

        <h3 className="text-xl font-semibold text-[#00e5ff] mb-4">
          Members ({team.members.length} / 3)
        </h3>

        <ul className="space-y-4">
          {team.members.map((member) => (
            <li
              key={member._id}
              className="
                p-4 rounded-xl bg-[#001012]/80 backdrop-blur-md
                border border-[#00ff7f44]
                shadow-[0_0_12px_rgba(0,255,127,0.2)]
                hover:shadow-[0_0_20px_rgba(0,255,200,0.3)]
                transition-all duration-300
                flex justify-between items-center
              "
            >
              <div>
                <p className="text-[#00ffcc] font-semibold text-lg">
                  {member.name}
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
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SIDE — ADD MEMBER (Only Leader) */}
      {isLeader && team.members.length < 3 && (
        <div
          className="
            p-8 rounded-xl bg-[#001012]/80 backdrop-blur-md
            border border-[#00e5ff44]
            shadow-[0_0_20px_rgba(0,229,255,0.25)]
          "
        >
          <h3 className="text-2xl font-bold text-[#00e5ff] mb-4">
            Add Member
          </h3>

          <p className="text-gray-400 text-sm mb-4">
            Enter the email of a registered user to add them to your team.
          </p>

          <form onSubmit={handleAddMember} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Member email"
              className="
                w-full px-3 py-2 rounded-md bg-[#020e0c]
                border border-[#00ff7f55] text-[#bfffe7]
                focus:border-[#00ffcc] focus:ring-[#00ffcc] focus:ring-2
                placeholder-gray-500
              "
            />

            <Button
              type="submit"
              className="w-full text-lg bg-[#00e5ff] hover:bg-[#00c2e6]
                         text-black font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]"
            >
              Add Member
            </Button>
          </form>
        </div>
      )}

    </div>
  );
};

export default TeamDetails;
