'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
    Typography, Container, Box, Button, Grid, Card, CardContent, Avatar,
    Accordion, AccordionSummary, AccordionDetails, CssBaseline
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const features = [
    {
        icon: <EventAvailableIcon fontSize="large" color="primary" />,
        title: 'AI-Powered Planning',
        description: 'Generate event ideas, schedules, and plans with the power of AI.',
    },
    {
        icon: <TimelineIcon fontSize="large" color="primary" />,
        title: 'Real-Time Collaboration',
        description: 'Collaborate with your team in real-time to ensure seamless planning.',
    },
    {
        icon: <EmojiEventsIcon fontSize="large" color="primary" />,
        title: 'Smart Recommendations',
        description: 'Get smart suggestions on venues, vendors, and more based on your preferences.',
    },
];

const testimonials = [
    {
        name: 'Ava Johnson',
        feedback: 'Eventifyy made planning our corporate event seamless and enjoyable!',
        avatar: '/avatars/ava.jpg'
    },
    {
        name: 'Liam Patel',
        feedback: 'The AI suggestions saved us hours of brainstorming. Incredible!',
        avatar: '/avatars/liam.jpg'
    },
];

const faqs = [
    {
        question: 'Is Eventifyy free to use?',
        answer: 'We offer a free plan with limited features, and premium plans for advanced needs.',
    },
    {
        question: 'Can I collaborate with others?',
        answer: 'Yes, real-time collaboration is one of our core features.',
    },
];

export default function LandingPage2() {
    const router = useRouter();
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const particlesRef = useRef(null);
    const animationIdRef = useRef(null);

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: { main: '#1976d2' },
            secondary: { main: '#42a5f5' },
        },
    });

    const handleGetStarted = () => router.push('/auth/login');
    const handleSignUp = () => router.push('/auth/register');

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }
        rendererRef.current = renderer;

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        particlesRef.current = particlesMesh;

        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            if (particlesRef.current) {
                particlesRef.current.rotation.x += 0.0005;
                particlesRef.current.rotation.y += 0.0005;
            }
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (camera && renderer) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationIdRef.current);
            window.removeEventListener('resize', handleResize);

            if (particlesMesh) {
                scene.remove(particlesMesh);
                particlesGeometry.dispose();
                particlesMaterial.dispose();
            }

            if (renderer && renderer.domElement && mountRef.current?.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement);
                renderer.dispose();
            }
        };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Three.js Background */}
            <div
                ref={mountRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                }}
            />

            {/* Content */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <Box
                    sx={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        px: 4,
                    }}
                >
                    <Typography
                        variant="h1"
                        component={motion.h1}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        sx={{
                            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                        }}
                    >
                        Welcome to Eventifyyy
                    </Typography>
                    <Typography
                        variant="h4"
                        component={motion.h4}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        sx={{ mb: 4, color: 'white' }}
                    >
                        Your Ultimate Event Management Platform
                    </Typography>
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleGetStarted}
                            sx={{ mr: 2 }}
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleSignUp}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Box>

                {/* Features Section */}
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Typography variant="h3" align="center" gutterBottom sx={{ color: 'white', mb: 6 }}>
                        Features That Make Us Stand Out
                    </Typography>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card
                                    component={motion.div}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Box mb={2}>{feature.icon}</Box>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                {/* Testimonials Section */}
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Typography variant="h3" align="center" gutterBottom sx={{ color: 'white', mb: 6 }}>
                        What Our Users Say
                    </Typography>
                    <Grid container spacing={4}>
                        {testimonials.map((testimonial, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card
                                    component={motion.div}
                                    whileHover={{ scale: 1.02 }}
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Avatar src={testimonial.avatar} sx={{ width: 56, height: 56, mr: 2 }} />
                                            <Typography variant="h6" sx={{ color: 'white' }}>
                                                {testimonial.name}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            {testimonial.feedback}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                {/* FAQ Section */}
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Typography variant="h3" align="center" gutterBottom sx={{ color: 'white', mb: 6 }}>
                        Frequently Asked Questions
                    </Typography>
                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            component={motion.div}
                            whileHover={{ scale: 1.01 }}
                            sx={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                mb: 2,
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                                <Typography sx={{ color: 'white' }}>{faq.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Container>

                {/* CTA Section */}
                <Box
                    sx={{
                        py: 8,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.2), rgba(66, 165, 245, 0.2))',
                    }}
                >
                    <Container maxWidth="md">
                        <Typography variant="h3" gutterBottom sx={{ color: 'white', mb: 4 }}>
                            Ready to Transform Your Event Planning?
                        </Typography>
                        <Button variant="contained" size="large" onClick={handleGetStarted} sx={{ mt: 2 }}>
                            Start Planning Now
                        </Button>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
