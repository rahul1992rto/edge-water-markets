import React from 'react';
import '../style.css';

const MatchView = ({ matchData }) => (
    <div className="match-view">
        <h2>Match View</h2>
        {matchData.length ? (
            <table className="match-table">
                <thead>
                    <tr>
                        <th>TimeStamp</th>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {matchData.map((match, index) => (
                        <tr key={index}>
                            <td>{match.time}</td>
                            <td>{match.product_id}</td>
                            <td className={match.side === 'buy' ? 'buy' : 'sell'}>{match.size}</td>
                            <td className={match.side === 'buy' ? 'buy' : 'sell'}>{match.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p className="no-data">No Match Data Available</p>
        )}
    </div>
);

export default MatchView;
