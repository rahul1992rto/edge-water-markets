import React from 'react';

const MatchView = ({ matchData }) => (
    <div>
        <h2>Match View</h2>
        {matchData.length ? (
            <div>
                {/* Header Row */}
                <div style={{ display: 'flex', fontWeight: 'bold', marginBottom: '8px' }}>
                    <span style={{ flex: 1 }}>TimeStamp</span>
                    <span style={{ flex: 1 }}>Product</span>
                    <span style={{ flex: 1 }}>Size</span>
                    <span style={{ flex: 1 }}>Price</span>
                </div>

                {/* Match Data Rows */}
                {matchData.map((match, index) => (
                    <div key={index} style={{ display: 'flex', color: match.side === 'buy' ? 'green' : 'red' }}>
                        <span style={{ flex: 1 }}>{match.time}</span>
                        <span style={{ flex: 1 }}>{match.product_id}</span>
                        <span style={{ flex: 1 }}>{match.size}</span>
                        <span style={{ flex: 1 }}>{match.price}</span>
                    </div>
                ))}
            </div>
        ) : (
            <p>No Match Data Available</p>
        )}
    </div>
);

export default MatchView;
