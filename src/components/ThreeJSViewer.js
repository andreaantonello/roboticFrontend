import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

const ThreeJSViewer = ({ urdfPath }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const loader = new STLLoader();

        const loadSTL = (filePath, onComplete) => {
            loader.load(
                filePath,
                geometry => {
                    const material = new THREE.MeshPhongMaterial();
                    const mesh = new THREE.Mesh(geometry, material);
                    onComplete(mesh);
                },
                undefined,
                err => {
                    console.error('Error loading STL:', err);
                    onComplete(null);
                }
            );
        };

        const loadURDF = async () => {
            const urdfMeshPath = `${urdfPath}/meshes`;

            // List of mesh filenames to load
            const meshFilenames = [
                'LINK_0_manual.STL',
                'LINK_1_manual.STL',
                'LINK_2_manual.STL',
                'LINK_3_manual.STL',
                'LINK_4_manual.STL',
                'LINK_5_manual.STL'
            ];

            // Load each mesh in parallel
            const meshLoadingPromises = meshFilenames.map(fileName => {
                const filePath = `${urdfMeshPath}/${fileName}`;
                return new Promise(resolve => {
                    loadSTL(filePath, mesh => {
                        if (mesh) {
                            scene.add(mesh);
                        }
                        resolve(); // Resolve the promise after loading the mesh
                    });
                });
            });

            // Wait for all meshes to finish loading
            await Promise.all(meshLoadingPromises);

            // Adjust camera position after loading all meshes
            camera.position.z = 5;
        };

        // Load URDF meshes when component mounts
        loadURDF();

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        // Start animation loop
        animate();

        // Cleanup function (optional)
        return () => {
            // Cleanup Three.js scene and resources if needed
        };
    }, [urdfPath]); // Re-run effect if urdfPath changes

    return <canvas ref={canvasRef} />;
};

export default ThreeJSViewer;
