import React from 'react';

const VoteCard = ({ country, votes, onVote }) => {
  return (
    <div className='vote-card'>
      <h3>{country}</h3>
      <p>Votes: {votes}</p>
      <button onClick={onVote}>Vote</button>
    </div>
  );
};

export default VoteCard;
