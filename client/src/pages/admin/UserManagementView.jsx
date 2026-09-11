import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';

const UserManagementView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showModal, user } = useAppContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('https://hackathon-backend1-akuo.onrender.com/api/auth/users');
        setUsers(data);
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch users';
        showModal(message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [showModal]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;

    try {
      await axios.delete(`https://hackathon-backend1-akuo.onrender.com
/api/auth/users/${userId}`);
      showModal('User removed successfully', 'success');
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (!user) return <p className="text-gray-300 text-center">Loading...</p>;
  if (loading) return <p className="text-gray-300 text-center">Loading users...</p>;

  return (
    <div className="relative">

      {/* HACKER BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(0,255,180,0.25),transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(90deg,#00ffcc33_1px,transparent_1px),linear-gradient(#00ffcc33_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <h2 className="text-3xl font-extrabold text-[#00F5FF] tracking-wider mb-6 neon-glow">
        USER CONTROL CENTER
      </h2>

      <div className="overflow-x-auto shadow-[0_0_25px_#00e1ff60] rounded-lg border border-[#00ffc873] bg-[#0a0f12]/80 backdrop-blur-xl">
        <table className="min-w-full divide-y divide-[#00ffc844]">
          <thead className="bg-[#001f1f]/70">
            <tr>
              {['Name', 'Email', 'College', 'Team', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-bold text-[#00ffe1] uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-[#0b1417] divide-y divide-[#00ffc822]">
            {users.map(u => (
              <tr
                key={u._id}
                className="hover:bg-[#012b2b] hover:shadow-[0_0_15px_#00eaff44] transition-all duration-300"
              >
                <td className="px-4 py-3 text-sm font-semibold text-white">{u.name}</td>
                <td className="px-4 py-3 text-sm text-[#87f5ff]">{u.email}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{u.college || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {u.teamId ? u.teamId.name : <span className="text-gray-500">None</span>}
                </td>

                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="px-3 py-1 text-xs bg-red-900 border border-red-500 text-red-200 rounded-md hover:bg-red-700 transition shadow-[0_0_10px_#ff4d4d66]"
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-6">
                  No users found.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementView;
