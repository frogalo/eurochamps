import React, { useState } from 'react';
import VoteCard from '../components/VoteCard';

const Voting = () => {
  const [votes, setVotes] = useState({});

  const handleVote = (country) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [country]: (prevVotes[country] || 0) + 1,
    }));
  };

  const countries = ['Sweden', 'Italy', 'France', 'Germany', 'Spain'];

  return (
    <div className='voting'>
      <h2>Vote for Your Favorite Country</h2>
      <div className='vote-cards'>
        {countries.map((country) => (
          <VoteCard
            key={country}
            country={country}
            votes={votes[country] || 0}
            onVote={() => handleVote(country)}
          />
        ))}
      </div>
    </div>
  );
};

export default Voting;
