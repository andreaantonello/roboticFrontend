import React, { useState, useEffect, useRef } from 'react';

const TelemetryDisplay = ({ webSocketUrl, setWebSocketUrl }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [telemetryData, setTelemetryData] = useState(null);
    const wsRef = useRef(null);

    // Function to handle WebSocket connection
    const handleConnect = () => {
        if (!isConnected) {
            const url = webSocketUrl.trim();
            if (url) {
                const socket = new WebSocket(url);
                socket.onopen = () => {
                    console.log('WebSocket connected');
                    setIsConnected(true);
                };
                socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    setTelemetryData(data);
                };
                socket.onclose = () => {
                    console.log('WebSocket disconnected');
                    setIsConnected(false);
                    setTelemetryData(null); // Clear telemetry data on disconnection
                };
                wsRef.current = socket;
            }
        }
    };

    // Function to handle WebSocket disconnection
    const handleDisconnect = () => {
        if (isConnected) {
            wsRef.current.close();
            setIsConnected(false);
            setTelemetryData(null); // Clear telemetry data on disconnection
        }
    };

    return (
        <div className="telemetry-container">
            <h2>Telemetry Display</h2>
            <div className="websocket-box">
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
            {/* Display telemetry data */}
            {telemetryData && (
                <div className="telemetry-display">
                    <h3>Telemetry Data</h3>
                    <ul>
                        {telemetryData.joints.map((joint) => (
                            <li key={joint.index}>
                                Joint {joint.index}:<br />
                                Position: {joint.position.toFixed(2)} rad<br />
                                Velocity: {joint.velocity.toFixed(2)} rad/s<br />
                                Current: {joint.current.toFixed(2)} A<br />
                                Temperature: {joint.temperature.toFixed(2)} °C
                            </li>
                        ))}
                    </ul>
                    <p>Timestamp: {new Date(telemetryData.timestamp).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};

export default TelemetryDisplay;
