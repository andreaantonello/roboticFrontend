import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import URDFLoader from 'urdf-loader';

const URDFViewer = ({ urdfPath }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const loader = new URDFLoader();

        // Create a Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        // Load the URDF model
        loader.load(urdfPath, (robot) => {
            scene.add(robot);

            // Automatically fit the camera to view the entire model
            const box = new THREE.Box3().setFromObject(robot);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxSize = Math.max(size.x, size.y, size.z);
            const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
            const fitWidthDistance = fitHeightDistance / camera.aspect;
            const distance = Math.max(fitHeightDistance, fitWidthDistance);
            camera.position.copy(center);
            camera.position.z += distance;

            // Render loop
            const animate = () => {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };
            animate();
        });

        return () => {
            // Clean up on component unmount
            scene.dispose();
            renderer.dispose();
        };
    }, [urdfPath]);

    return <div ref={containerRef} />;
};

export default URDFViewer;
