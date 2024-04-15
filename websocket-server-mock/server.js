const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8765 });
console.log('WebSocket server started on ws://localhost:8765');

// Function to generate sinusoidal values with specified parameters
function generateSinusoidalValue(min, max, frequency, offset) {
    const amplitude = (max - min) / 2;
    const mean = (max + min) / 2;
    const value = amplitude * Math.sin(2 * Math.PI * frequency * Date.now() / 1000 + offset) + mean;
    return value;
}

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    // Interval to send telemetry messages at 10Hz (every 100ms)
    const messageInterval = setInterval(() => {
        const timestamp = Date.now(); // Get current timestamp in milliseconds
        const telemetryData = {
            timestamp: timestamp,
            joints: []
        };

        // Simulate telemetry data for 6 joints
        for (let i = 0; i < 6; i++) {
            const jointData = {
                index: i,
                position: generateSinusoidalValue(-Math.PI, Math.PI, 0.5, i * Math.PI / 3), // Sinusoidal position (-π to π) with 0.5Hz frequency

                velocity: generateSinusoidalValue(-1, 1, 0.5, i * Math.PI / 3 + Math.PI / 2), // Sinusoidal velocity (-1 to 1) with 0.5Hz frequency

                current: Math.abs(generateSinusoidalValue(0, 5, 0.5, i * Math.PI / 3 + Math.PI)), // Absolute sinusoidal current (0 to 5) with 0.5Hz frequency

                temperature: generateSinusoidalValue(20, 50, 0.5, i * Math.PI / 3 - Math.PI / 2) // Sinusoidal temperature (20 to 50°C) with 0.5Hz frequency
            };
            telemetryData.joints.push(jointData);
        }

        // Convert telemetry data to JSON string and send to client
        const message = JSON.stringify(telemetryData);
        ws.send(message);
    }, 100); // 100ms interval for 10Hz (10 messages per second)

    ws.on('close', function close() {
        console.log('Client disconnected');
        clearInterval(messageInterval); // Stop sending messages when client disconnects
    });
});
