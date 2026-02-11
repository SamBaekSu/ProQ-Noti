'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const RiotPuuid = () => {
  const [puuid, setPuuid] = useState('');

  const fetchAccount = async (puuid: string) => {
    const response = await fetch(`/api/account?puuid=${puuid}`);
    if (!response.ok) throw new Error('실패요');
    return response.json();
  };

  const {
    data: accountData,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['riotAccount', puuid],
    queryFn: () => fetchAccount(puuid),
    enabled: false,
    retry: 1
  });

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Enter PUUID"
        value={puuid}
        onChange={(e) => setPuuid(e.target.value)}
        className="p-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={() => refetch()}
        disabled={!puuid || isFetching}
        className="p-2 ml-2 bg-blue-500 text-white rounded-md"
      >
        {isFetching ? '로딩중...' : '계정 로딩'}
      </button>

      {error && <p className="text-red-500 mt-2">에러입니다.</p>}

      {accountData && (
        <div className="mt-4 p-4 border rounded">
          <p>
            <strong>Game Name:</strong> {accountData.gameName || 'N/A'}
          </p>
          <p>
            <strong>Tag Line:</strong> {accountData.tagLine || 'N/A'}
          </p>
          <p>
            <strong>PUUID:</strong> {accountData.puuid}
          </p>
        </div>
      )}
    </div>
  );
};

export default RiotPuuid;
