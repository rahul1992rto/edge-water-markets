import React, { useEffect, useState } from 'react';
import Subscribe from './Subscribe';
import PriceView from './PriceView';
import MatchView from './MatchView';
import SystemStatus from './SystemStatus';
// import '../style.css';

const App = () => {
    const [ws, setWs] = useState(null);
    const [subscriptions, setSubscriptions] = useState(new Set());
    const [level2Data, setLevel2Data] = useState({});
    const [matchData, setMatchData] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const websocket = new WebSocket(`ws://localhost:4000?token=${token}`);
        setWs(websocket);

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("data")
            console.log(data)
            console.log("data")
            if (data.type === 'l2update') setLevel2Data(data);
            if (data.type === 'match') setMatchData((prev) => [data, ...prev.slice(0, 5)]);
            // websocket.close();
        };
        websocket.onclose = () => {
            console.log('closing connection')
            websocket.close()
          }

        // return () => websocket.close();
    }, []);

    const handleSubscribe = (product) => {
        setSubscriptions((prev) => new Set(prev.add(product)));
        ws.send(JSON.stringify({ type: 'subscribe', product_id: product }));
    };

    const handleUnsubscribe = (product) => {
        setSubscriptions((prev) => {
            const newSet = new Set(prev);
            newSet.delete(product);
            return newSet;
        });
        ws.send(JSON.stringify({ type: 'unsubscribe', product_id: product }));
    };

    return (
        <div className="app-container">
            <div className="component-box subscribe-container">
                <h2>Subscribe</h2>
                <Subscribe 
                    onSubscribe={handleSubscribe} 
                    onUnsubscribe={handleUnsubscribe} 
                    subscriptions={subscriptions} 
                />
            </div>

            <div className="component-box system-status">
                <SystemStatus channels={Array.from(subscriptions)} />
            </div>

            <div className="component-box price-view">
                <PriceView level2Data={level2Data} />
            </div>

            <div className="component-box match-view">
                <MatchView matchData={matchData} />
            </div>
        </div>
    );
};

export default App;
