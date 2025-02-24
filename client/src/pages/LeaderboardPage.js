import React from 'react';

const LeaderboardPage = () => {
  const leaderboard = [
    { country: 'Sweden', votes: 10 },
    { country: 'Italy', votes: 8 },
    { country: 'France', votes: 6 },
  ];

  return (
    <div className='leaderboard'>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {index + 1}. {entry.country} - {entry.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardPage;
