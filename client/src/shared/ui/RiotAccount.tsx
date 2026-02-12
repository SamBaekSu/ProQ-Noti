'use client';

import { useState } from 'react';

const RiotAccount = () => {
  const [riotId, setRiotId] = useState('');
  const [_accountData, setAccountData] = useState(null);
  const [error, setError] = useState('');

  const fetchAccount = async () => {
    setError('');
    setAccountData(null);

    const [gameName, tagLine = '#KR1'] = riotId.split('#');

    const response = await fetch(
      `/api/account?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`
    );
    const data = await response.json();

    if (response.ok) {
      setAccountData(data);
    } else {
      setError(data.error || 'Failed to fetch account');
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Enter Game Name"
        value={riotId}
        onChange={(e) => setRiotId(e.target.value)}
        className="p-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={fetchAccount}
        className="p-2 ml-2 bg-blue-500 text-white rounded-md"
      >
        Fetch Account
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default RiotAccount;
