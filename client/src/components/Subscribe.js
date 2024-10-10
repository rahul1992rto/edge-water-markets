import React, { useState } from 'react';

const Subscribe = ({ onSubscribe, onUnsubscribe, subscriptions }) => {
    const [product, setProduct] = useState('BTC-USD');

    return (
        <div>
            <select onChange={(e) => setProduct(e.target.value)} value={product}>
                <option value="BTC-USD">BTC-USD</option>
                <option value="ETH-USD">ETH-USD</option>
                <option value="XRP-USD">XRP-USD</option>
                <option value="LTC-USD">LTC-USD</option>
            </select>
            <button onClick={() => onSubscribe(product)}>Subscribe</button>
            <button onClick={() => onUnsubscribe(product)}>Unsubscribe</button>
            <ul>
                {Array.from(subscriptions).map((sub) => (
                    <li key={sub}>{sub}</li>
                ))}
            </ul>
        </div>
    );
};

export default Subscribe;
