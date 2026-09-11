import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Button from '../../components/Button';

const PaymentView = () => {
  const { user, showModal } = useAppContext();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const [transactionId, setTransactionId] = useState('');
  const [file, setFile] = useState(null);

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

    if (user && user.teamId) fetchMyTeam();
    else setLoading(false);

  }, [user, showModal]);

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!transactionId || !file) {
      showModal('Please provide both a transaction ID and a proof file.');
      return;
    }

    const formData = new FormData();
    formData.append('transactionId', transactionId);
    formData.append('proof', file);

    try {
      const { data } = await axios.post(
        'https://hackathon-backend1-akuo.onrender.com/api/payments/submit-proof',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      showModal(data.message, 'success');
      setTeam(prev => ({
        ...prev,
        paymentStatus: 'pending',
        transactionId: 'Submitted',
        paymentProof: true
      }));

    } catch (error) {
      showModal(error.response?.data?.message || 'Failed to submit proof');
    }
  };

  if (loading) {
    return (
      <p className="text-[#9AE6C7] text-center animate-pulse">
        Loading payment status...
      </p>
    );
  }

  if (!team) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#00ff7f] to-[#00e5ff] bg-clip-text text-transparent">
          Payment
        </h2>
        <p className="text-[#9AE6C7]">
          You must create or join a team before you can make a payment.
        </p>
      </div>
    );
  }

  if (team.paymentStatus === 'completed') {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#00ff7f] to-[#00e5ff] bg-clip-text text-transparent">
          Team Payment (₹2000)
        </h2>

        <div className="bg-[#002e1f]/60 border border-[#00ff7f66] p-5 rounded-lg 
                        shadow-[0_0_20px_rgba(0,255,127,0.2)]">
          <p className="text-[#00ff7f] font-bold">Payment Verified</p>
          <p className="text-[#9AE6C7]">
            Your team is fully registered and eligible to compete.
          </p>
        </div>
      </div>
    );
  }

  if (team.paymentProof) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#00ff7f] to-[#00e5ff] bg-clip-text text-transparent">
          Team Payment (₹2000)
        </h2>

        <div className="bg-[#332600]/40 border border-[#ffda4f99] p-5 rounded-lg 
                        shadow-[0_0_20px_rgba(255,255,0,0.2)]">
          <p className="text-yellow-300 font-bold">Proof Submitted</p>
          <p className="text-[#e8e3c2]">
            Awaiting admin verification. This may take up to 24 hours.
          </p>
        </div>
      </div>
    );
  }

  const isLeader = user._id === team.leader._id;

  return (
    <div>

      {/* HEADER */}
      <h2 className="text-3xl font-extrabold mb-6 
                     bg-gradient-to-r from-[#00ff7f] to-[#00e5ff]
                     bg-clip-text text-transparent
                     drop-shadow-[0_0_18px_rgba(0,255,127,0.4)]">
        Team Payment (₹2000)
      </h2>

      {!isLeader && (
        <p className="text-[#ffd860] mb-6">
          Please ask your team leader ({team.leader.name}) to complete the payment.
        </p>
      )}

      {/* PAYMENT DETAILS BOX */}
      <div className="bg-[#001012]/80 p-5 rounded-xl border border-[#00ff7f33]
                      shadow-[0_0_25px_rgba(0,255,127,0.15)] mb-6 backdrop-blur">
        <h3 className="text-[#00e5ff] font-semibold text-lg mb-2">
          Payment Details
        </h3>

        <p className="text-[#9AE6C7] mb-3">
          Deposit ₹2000 to the account below. Upload a screenshot or transaction ID.
        </p>

        <div className="bg-[#041f1a]/60 p-4 rounded-lg text-[#9AE6C7] border border-[#00ff7f22] space-y-1">
          <p><strong>Account Holder:</strong> Malaya D. Baruah</p>
          <p><strong>Account Number:</strong> 1234567890</p>
          <p><strong>Bank:</strong> SBI, NIT Silchar</p>
          <p><strong>IFSC Code:</strong> SBIN0007061</p>
        </div>
      </div>

      {isLeader && (
        <form onSubmit={handleSubmitProof} className="space-y-4">

          {/* TRANSACTION ID */}
          <input
            type="text"
            placeholder="Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full px-3 py-3 bg-[#020e0c] text-[#bfffe7]
                       border border-[#00ff7f40] rounded-md
                       placeholder-[#77a69a]
                       focus:outline-none focus:ring-2 focus:ring-[#00ff7f]
                       transition-all"
          />

          {/* FILE UPLOAD */}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="
              block w-full text-sm text-[#9AE6C7]
              file:mr-4 file:py-2 file:px-4 
              file:rounded-md file:border-0 
              file:font-semibold 
              file:bg-[#00e5ff] file:text-black
              hover:file:bg-[#00c2ff]
              transition-all
            "
          />

          <Button type="submit" className="w-full justify-center">
            Submit Payment Proof
          </Button>
        </form>
      )}
    </div>
  );
};

export default PaymentView;
