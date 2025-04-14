import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const particlesRef = useRef(null);

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current = renderer;

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 3000;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i += 3) {
            // Position
            posArray[i] = (Math.random() - 0.5) * 10;
            posArray[i + 1] = (Math.random() - 0.5) * 10;
            posArray[i + 2] = (Math.random() - 0.5) * 10;

            // Colors - mix of cyan and purple
            const color = new THREE.Color();
            if (Math.random() > 0.5) {
                color.setHSL(0.6, 1, 0.5); // Cyan
            } else {
                color.setHSL(0.8, 1, 0.5); // Purple
            }
            colorArray[i] = color.r;
            colorArray[i + 1] = color.g;
            colorArray[i + 2] = color.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        // Create particle material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        // Create particle system
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        particlesRef.current = particlesMesh;
        scene.add(particlesMesh);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Camera position
        camera.position.z = 5;

        // Animation
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            if (particlesRef.current) {
                particlesRef.current.rotation.x += 0.0003;
                particlesRef.current.rotation.y += 0.0003;

                // Add some subtle movement to particles
                const positions = particlesRef.current.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] += (Math.random() - 0.5) * 0.01;
                    positions[i + 1] += (Math.random() - 0.5) * 0.01;
                    positions[i + 2] += (Math.random() - 0.5) * 0.01;
                }
                particlesRef.current.geometry.attributes.position.needsUpdate = true;
            }

            renderer.render(scene, camera);
        };

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (mountRef.current && rendererRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
            if (sceneRef.current && particlesRef.current) {
                sceneRef.current.remove(particlesRef.current);
            }
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
};

export default ThreeBackground; 