import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const WebSocketHandler = () => {
    const canvasRef = useRef();

    useEffect(() => {
        const socket = new WebSocket('ws://example.com/socket');

        // Setup Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Create a cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Position and animate the cube
        camera.position.z = 5;
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();

        // WebSocket event handlers
        socket.onmessage = (event) => {
            console.log('Received message:', event.data);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed.');
        };

        // Cleanup function to close WebSocket on component unmount
        return () => {
            socket.close();
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100vh', display: 'block' }} />;
};

export default WebSocketHandler;