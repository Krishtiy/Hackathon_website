import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

// 🔥 REUSABLE BASE URL (change this if backend URL changes)
const API_BASE = "https://hackathon-backend1-akuo.onrender.com";

const CertificateView = () => {
  const { user, showModal } = useAppContext();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  // File state
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/state`);
      setState(data);
    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to fetch state');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleUpload = async (e, round) => {
    e.preventDefault();
    const file = round === 1 ? file1 : file2;

    if (!file) {
      showModal('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('certificate', file); // must match backend

    try {
      const { data } = await axios.post(
        `${API_BASE}/api/state/certificate/${round}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setState(data.state);
      showModal('Certificate uploaded!', 'success');

      setFile1(null);
      setFile2(null);
    } catch (error) {
      showModal(error.response?.data?.message || 'Upload failed');
    }
  };

  if (!user || loading) {
    return <p className="text-gray-300 text-center">Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Certificate Management</h2>

      {/* --- Round 1 Upload --- */}
      <Card className="bg-gray-800 p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Round 1 (Participation)</h3>

        {state.round1CertificatePath ? (
          <p className="text-green-400">
            Current File: {state.round1CertificatePath}
          </p>
        ) : (
          <p className="text-yellow-400">No template uploaded yet.</p>
        )}

        <form onSubmit={(e) => handleUpload(e, 1)} className="mt-4 space-y-4">
          <input
            type="file"
            accept=".pdf,.png,.jpg"
            onChange={(e) => setFile1(e.target.files[0])}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
                     file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          />
          <Button type="submit">Upload R1 Certificate</Button>
        </form>
      </Card>

      {/* --- Round 2 Upload --- */}
      <Card className="bg-gray-800 p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Round 2 (Advancement)</h3>

        {state.round2CertificatePath ? (
          <p className="text-green-400">
            Current File: {state.round2CertificatePath}
          </p>
        ) : (
          <p className="text-yellow-400">No template uploaded yet.</p>
        )}

        <form onSubmit={(e) => handleUpload(e, 2)} className="mt-4 space-y-4">
          <input
            type="file"
            accept=".pdf,.png,.jpg"
            onChange={(e) => setFile2(e.target.files[0])}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
                     file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          />
          <Button type="submit">Upload R2 Certificate</Button>
        </form>
      </Card>
    </div>
  );
};

export default CertificateView;
