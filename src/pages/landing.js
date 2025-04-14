import React from 'react';
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
        feedback: 'Eventify made planning our corporate event seamless and enjoyable!',
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
        question: 'Is Eventify free to use?',
        answer: 'We offer a free plan with limited features, and premium plans for advanced needs.',
    },
    {
        question: 'Can I collaborate with others?',
        answer: 'Yes, real-time collaboration is one of our core features.',
    },
];

export default function EventifyLandingPage() {
    const router = useRouter();

    const theme = createTheme();

    const handleGetStarted = () => {
        router.push('/auth/login');
    };

    const handleSignUp = () => {
        router.push('/auth/register');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {/* Fullscreen Banner */}
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                sx={{
                    height: '90vh',
                    width: '100%',
                    position: 'relative',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    px: 2,
                    backgroundImage: 'url(/assets/banner2.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1,
                    },
                    zIndex: 2,
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 3 }}>
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        Plan Events Effortlessly with Eventify
                    </Typography>
                    <Typography variant="h6" mb={4}>
                        Your AI co-pilot for unforgettable events.
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        component={motion.button}
                        whileHover={{ scale: 1.1 }}
                        onClick={handleGetStarted}
                    >
                        Start Planning
                    </Button>
                </Box>
            </Box>


            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* Hero Section */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    textAlign="center"
                    mb={8}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                            fontWeight: 'bold',
                            color: '#36454F',
                            textAlign: 'center',
                            mb: 2,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        Welcome to Eventify
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                            fontWeight: 'normal',
                            color: '#36454F', textAlign: 'center',
                            mb: 4,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                        }}
                    >
                        Your Ultimate Event Management Platform
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                            fontWeight: 'normal',
                            color: '#36454F', textAlign: 'center',
                            mb: 4,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                        }}
                    >
                        Plan, organize, and manage your events with ease. From corporate meetings to social gatherings, we&apos;ve got you covered.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ mt: 3 }}
                        component={motion.button}
                        whileHover={{ scale: 1.1 }}
                        onClick={handleGetStarted}
                    >
                        Get Started
                    </Button>
                </Box>

                {/* Banner 1 */}
                <Box
                    component={motion.div}
                    mb={10}
                    p={6}
                    textAlign="center"
                    sx={{ background: 'linear-gradient(135deg, #1976d2, #42a5f5)', color: 'white', borderRadius: 4 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Plan Smarter, Not Harder
                    </Typography>
                    <Typography variant="h6">
                        Let Eventify handle the logistics while you focus on the experience.
                    </Typography>
                </Box>

                {/* Features */}
                <Box mb={10}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        align="center"
                        gutterBottom
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        Features That Make Us Stand Out
                    </Typography>
                    <Grid container spacing={4} mt={2}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card
                                    component={motion.div}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    elevation={6}
                                >
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Box mb={2}>{feature.icon}</Box>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {feature.title}
                                        </Typography>
                                        <Typography color="text.secondary">{feature.description}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Banner 2 */}
                <Box
                    component={motion.div}
                    mb={10}
                    p={6}
                    textAlign="center"
                    sx={{ background: 'linear-gradient(135deg, #8e24aa, #ba68c8)', color: 'white', borderRadius: 4 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Seamless Planning, Flawless Execution
                    </Typography>
                    <Typography variant="h6">
                        Your perfect event is just a few clicks away with Eventify.
                    </Typography>
                </Box>

                {/* Testimonials */}
                <Box mb={10}>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                        What Our Users Say
                    </Typography>
                    <Grid container spacing={4} mt={2}>
                        {testimonials.map((testimonial, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card
                                    component={motion.div}
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {testimonial.name}
                                            </Typography>
                                        </Box>
                                        <Typography color="text.secondary">{testimonial.feedback}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* FAQ */}
                <Box mb={10}>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                        Frequently Asked Questions
                    </Typography>
                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            component={motion.div}
                            whileInView={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1" fontWeight="bold">{faq.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{faq.answer}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>

                {/* Call to Action */}
                <Box
                    component={motion.div}
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    textAlign="center"
                    py={6}
                    bgcolor="#f5f5f5"
                    borderRadius={4}
                >
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Ready to Plan Smarter?
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        Experience the future of event planning today.
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        component={motion.button}
                        whileHover={{ scale: 1.1 }}
                        onClick={handleSignUp}
                    >
                        Sign Up Now
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
