import React from 'react';

const MatchView = ({ matchData }) => (
    <div>
        <h2>Match View</h2>
        {matchData.length ? (
            matchData.map((match, index) => (
                <p key={index} style={{ color: match.side === 'buy' ? 'green' : 'red' }}>
                    {`${match.time}: ${match.size} ${match.price}`}
                </p>
            ))
        ) : (
            <p>No Match Data Available</p>
        )}
    </div>
);

export default MatchView;
