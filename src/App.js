import React, { useState, useRef } from 'react';
import './App.css';
import Box from './components/Box';
import ThreeScene from './components/ThreeScene';
import WebSocketHandler from './components/WebSocketHandler';
import URDFViewer from './components/URDFViewer';
import TelemetryDisplay from './components/TelemetryDisplay'; // Import TelemetryDisplay component


function App() {
    const [isConnected, setIsConnected] = useState(false);
    const [webSocketUrl, setWebSocketUrl] = useState('');
    const [positions, setPositions] = useState(Array(7).fill(0)); // Initialize positions array for 6 joints
    const [velocities, setVelocities] = useState(Array(7).fill(0)); // Initialize velocities array for 6 joints
    const [currents, setCurrents] = useState(Array(7).fill(0)); // Initialize currents array for 6 joints
    const wsRef = useRef(null);

    const handleConnect = () => {
        if (!isConnected) {
            const url = webSocketUrl.trim();
            if (url) {
                const socket = new WebSocket(url);
                socket.onopen = () => {
                    console.log('WebSocket connected');
                    setIsConnected(true);
                };
                socket.onclose = () => {
                    console.log('WebSocket disconnected');
                    setIsConnected(false);
                };
                socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    console.log('Received WebSocket data:', data);

                    if (data && data.joints) {
                        const newPositions = data.joints.map((joint) => joint.position);
                        const newVelocities = data.joints.map((joint) => joint.velocity);
                        const newCurrents = data.joints.map((joint) => joint.current);
                        setPositions(newPositions);
                        setVelocities(newVelocities);
                        setCurrents(newCurrents);
                    }
                };
                wsRef.current = socket;
            }
        }
    };

    const handleDisconnect = () => {
        if (wsRef.current && isConnected) {
            wsRef.current.close();
            setIsConnected(false);
        }
    };

    return (
        <div className="container">
            <div className="sidebar">
                <h2>Live telemetry</h2>
                <input
                    type="text"
                    value={webSocketUrl}
                    onChange={(e) => setWebSocketUrl(e.target.value)}
                    placeholder="Enter WebSocket URL..."
                />
                {!isConnected ? (
                    <button onClick={handleConnect}>Connect</button>
                ) : (
                    <button onClick={handleDisconnect}>Disconnect</button>
                )}
            </div>
            <div className="main-content">
                <div className="row">
                    <Box title="Box 1" jointNumber="1" isConnected={isConnected} position={positions[0]}
                         velocity={velocities[0]} current={currents[0]}/>
                    <Box title="Box 2" jointNumber="2" isConnected={isConnected} position={positions[1]}
                         velocity={velocities[0]} current={currents[0]}/>
                    <Box title="Box 3" jointNumber="3" isConnected={isConnected} position={positions[2]}
                         velocity={velocities[0]} current={currents[0]}/>
                </div>
                <div className="row">
                    <Box title="Box 4" jointNumber="4" isConnected={isConnected} position={positions[3]}
                         velocity={velocities[0]} current={currents[0]}/>
                    <Box title="Box 5" jointNumber="5" isConnected={isConnected} position={positions[4]}
                         velocity={velocities[0]} current={currents[0]}/>
                    <Box title="Box 6" jointNumber="6" isConnected={isConnected} position={positions[5]}
                         velocity={velocities[0]} current={currents[0]}/>
                </div>
                <TelemetryDisplay
                    webSocketUrl={webSocketUrl}
                    setWebSocketUrl={setWebSocketUrl} // Pass setWebSocketUrl as a prop
                    onChange={(e) => setWebSocketUrl(e.target.value)}
                    placeholder="Enter WebSocket URL..."
                />
            </div>
            <ThreeScene/>
            <h1>Real-Time Live Chart</h1>
            {/*<LiveChart/>*/}
            {/*<PositionChart positions={positions}/>*/}
        </div>
    );
}

export default App;
