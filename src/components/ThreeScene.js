import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import URDFLoader from 'urdf-loader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'


const ThreeScene = () => {
    const canvasRef = useRef();

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true});
        const path = './urdf/urdf/V1_0_0_FM_no_sat.urdf';
        const pathMeshes = './urdf/meshes';

        const loader = new URDFLoader();
        loader.loadMeshCb = function( path, manager, onComplete ) {

            new STLLoader(manager).load(
                pathMeshes,
                result => {
                    const material = new THREE.MeshPhongMaterial();
                    const mesh = new THREE.Mesh(result, material);
                    onComplete( result.scene );
                },
                null,
                err => onComplete(null, err),
            );

            // const stlLoader = new STLLoader( manager );
            // stlLoader.load(
            //     pathMeshes,
            //     result => {
            //         onComplete( result.scene );
            //     },
            //     undefined,
            //     err => {
            //         onComplete( null, err );
            //     }
            // );
        };
        loader.load( path, robot => {
            robot.rotation.x -= 90;
            robot.rotation.z += 90;
            scene.add(robot);
        } );

        // Light setup
        const dirLight2 = new THREE.DirectionalLight(0xffffff);
        dirLight2.position.set(4, 10, 1);
        dirLight2.shadow.mapSize.width = 2048;
        dirLight2.shadow.mapSize.height = 2048;
        dirLight2.shadow.normalBias = 0.001;
        dirLight2.castShadow = true;

        const ambientLight = new THREE.HemisphereLight('#8ea0a8', '#000');
        ambientLight.groundColor.lerp(ambientLight.color, 0.5);
        ambientLight.intensity = 0.5;
        ambientLight.position.set(0, 1, 0);

        scene.add(dirLight2);
        scene.add(dirLight2.target);
        scene.add(ambientLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.rotateSpeed = 1;

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        // Set initial camera position
        camera.position.z = 5;

        // Set renderer size and start animation loop
        renderer.setSize(window.innerWidth, window.innerHeight);
        animate();

        return () => {
            // Clean up controls on unmount
            controls.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default ThreeScene;



//
// import React, { useEffect } from 'react';
// import * as THREE from 'three';
// import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
// import URDFManipulator from './urdf-manipulator-element.js';
//
// // Register URDFManipulator custom element
// customElements.define('urdf-viewer', URDFManipulator);
//
// const ThreeScene = () => {
//     useEffect(() => {
//         // Initialize Three.js scene
//         const scene = new THREE.Scene();
//         const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//         const renderer = new THREE.WebGLRenderer();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         document.body.appendChild(renderer.domElement);
//
//         // Add light to the scene
//         const light = new THREE.PointLight(0xffffff, 1, 100);
//         light.position.set(0, 0, 5);
//         scene.add(light);
//
//         // Load URDF model using URDFManipulator
//         const viewer = document.createElement('urdf-viewer');
//         viewer.up = '-Z';
//         // viewer.style.display = 'none'; // Hide the viewer element
//         document.body.appendChild(viewer);
//
//         // Function to load custom meshes based on file extension
//         viewer.loadMeshFunc = (path, manager, done) => {
//             const ext = path.split('.').pop().toLowerCase();
//             switch (ext) {
//                 case 'gltf':
//                 case 'glb':
//                     new GLTFLoader(manager).load(path, result => done(result.scene), null, err => done(null, err));
//                     break;
//                 case 'obj':
//                     new OBJLoader(manager).load(path, result => done(result), null, err => done(null, err));
//                     break;
//                 case 'dae':
//                     new ColladaLoader(manager).load(path, result => done(result.scene), null, err => done(null, err));
//                     break;
//                 case 'stl':
//                     new STLLoader(manager).load(path, result => {
//                         const material = new THREE.MeshPhongMaterial();
//                         const mesh = new THREE.Mesh(result, material);
//                         done(mesh);
//                     }, null, err => done(null, err));
//                     break;
//                 default:
//                     done(null, new Error(`Unsupported file format: ${ext}`));
//             }
//         };
//
//         // Clean up function on component unmount
//         return () => {
//             document.body.removeChild(renderer.domElement);
//             document.body.removeChild(viewer);
//         };
//     }, []); // Run this effect once on component mount
//
//     return null; // ThreeScene is purely for side effects, doesn't render any component
// };
//
// export default ThreeScene;
