import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    CircularProgress,
    Chip,
    Stack
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import axios from 'axios';
import { baseUrl, myCreatedEventsAPI } from 'src/config/api';
import { useUserStore } from 'src/store/useStore';
import { EventView } from 'src/sections/event/eventView';
import { ExcelUpload } from 'src/sections/event/excelUpload';
import moment from 'moment';
import { motion } from 'framer-motion';
import { EventAdd } from 'src/sections/event/eventAdd';
import { MyCreatedEventView } from 'src/sections/event/myCreatedEventView';

const Page = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [excelOpen, setExcelOpen] = useState(false);
    const userDetails = useUserStore((state) => state.userDetailsStore);

    useEffect(() => {
        fetchEvents();
    }, [userDetails]);

    const fetchEvents = async () => {
        try {
            if (!userDetails?._id) {
                console.log('No user ID found');
                setLoading(false);
                return;
            }
            console.log('Fetching events for user:', userDetails._id);
            const response = await axios.get(myCreatedEventsAPI(userDetails._id));
            console.log('API Response:', response.data);
            if (response.data && Array.isArray(response.data)) {
                setEvents(response.data);
            } else {
                console.error('Invalid response format:', response.data);
                setEvents([]);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
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
                <title>My Created Events | Eventify</title>
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
                            My Created Events
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setAddOpen(true)}
                            >
                                Add Event
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setExcelOpen(true)}
                            >
                                Upload Excel
                            </Button>
                        </Stack>
                    </Stack>
                    {events.length === 0 ? (
                        <Card sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6" color="textSecondary">
                                You haven't created any events yet
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
                                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={() => handleViewEvent(event)}
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setSelectedEvent(event);
                                                        setExcelOpen(true);
                                                    }}
                                                >
                                                    Invite Users
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>
            {selectedEvent && (
                <MyCreatedEventView
                    open={viewOpen}
                    setOpen={setViewOpen}
                    item={selectedEvent}
                    userDetails={userDetails}
                    showScheduleOptions={true}
                />
            )}
            <EventAdd
                open={addOpen}
                setOpen={setAddOpen}
                fetchEvents={fetchEvents}
                userDetails={userDetails}
            />
            {selectedEvent && (
                <ExcelUpload
                    open={excelOpen}
                    setOpen={setExcelOpen}
                    eventId={selectedEvent._id}
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