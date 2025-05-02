import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Chip,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { getEvents } from 'src/config/api';
import { useUserStore } from 'src/store/useStore';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { EventView } from 'src/sections/event/eventView';
import { baseUrl } from 'src/config/api';
import moment from 'moment';
import { motion } from 'framer-motion';

const Page = () => {
    const [userDetails] = useUserStore(state => [state.userDetailsStore, state.updateUserDetails]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            let res = await axios.get(getEvents);
            const sortedEvents = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setEvents(sortedEvents);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleViewEvent = (event) => {
        setSelectedEvent(event);
        setViewOpen(true);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Head>
                <title>Events | Eventifyy</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                        <Typography variant="h4">
                            Events
                        </Typography>
                    </Stack>
                    {events.length === 0 ? (
                        <Card sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6" color="textSecondary">
                                No events found
                            </Typography>
                        </Card>
                    ) : (
                        <Grid container spacing={3}>
                            {events.map((event) => (
                                <Grid item xs={12} md={4} key={event._id}>
                                    <Card
                                        component={motion.div}
                                        whileHover={{ scale: 1.02 }}
                                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={baseUrl + `${event.bannerImage}`}
                                            alt={event.eventName}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {event.eventName}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" paragraph>
                                                {event.description?.slice(0, 100)}...
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Chip
                                                    label={event.eventType}
                                                    color="primary"
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                />
                                                <Chip
                                                    label={moment(event.eventTime).format('ll')}
                                                    color="secondary"
                                                    size="small"
                                                />
                                            </Box>
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Registered Users: {event.registeredUsers?.length || 0}
                                                </Typography>
                                            </Box>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={() => handleViewEvent(event)}
                                                sx={{ mt: 2 }}
                                            >
                                                View Details
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>
            {selectedEvent && (
                <EventView
                    open={viewOpen}
                    setOpen={setViewOpen}
                    item={selectedEvent}
                    userDetails={userDetails}
                    showScheduleOptions={false}
                />
            )}
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
