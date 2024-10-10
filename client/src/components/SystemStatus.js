import React from 'react';

const SystemStatus = ({ channels }) => (
    <div>
        <h2>System Status</h2>
        <ul>
            {channels.map((channel, index) => (
                <li key={index}>{channel}</li>
            ))}
        </ul>
    </div>
);

export default SystemStatus;
