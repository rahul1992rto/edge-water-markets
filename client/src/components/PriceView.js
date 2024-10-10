import React, { useEffect, useState } from 'react';

const PriceView = ({ level2Data }) => {
    const [displayData, setDisplayData] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayData(level2Data);
        }, 50);
        return () => clearInterval(interval);
    }, [level2Data]);

    return (
        <div>
            <h2>Price View</h2>
            {displayData ? (
                <p>{JSON.stringify(displayData)}</p>
            ) : (
                <p>No Data Available</p>
            )}
        </div>
    );
};

export default PriceView;
