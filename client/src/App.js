import React, { useEffect, useState } from 'react';
import Subscribe from './components/Subscribe';
import PriceView from './components/PriceView';
import MatchView from './components/MatchView';
import SystemStatus from './components/SystemStatus';

const App = () => {
    const [ws, setWs] = useState(null);
    const [subscriptions, setSubscriptions] = useState(new Set());
    const [level2Data, setLevel2Data] = useState({});
    const [matchData, setMatchData] = useState([]);

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:4000');
        setWs(websocket);

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("data")
            console.log(data)
            console.log("data")
            if (data.type === 'level2') setLevel2Data(data);
            if (data.type === 'match') setMatchData((prev) => [data, ...prev.slice(0, 10)]);
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
        <div>
            <SystemStatus channels={Array.from(subscriptions)} />
            <Subscribe
                onSubscribe={handleSubscribe}
                onUnsubscribe={handleUnsubscribe}
                subscriptions={subscriptions}
            />
            <PriceView level2Data={level2Data} />
            <MatchView matchData={matchData} />
        </div>
    );
};

export default App;
