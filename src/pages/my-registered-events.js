"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    CircularProgress,
    CardMedia,
    Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import { baseUrl, getMyEvents } from "src/config/api";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { EventView } from "src/sections/event/eventView";
import { useUserStore } from "src/store/useStore";
import { set } from "lodash";

const Page = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    // const [userDetails, setUserDetails] = useState(null);
    // const [userDetails, setUserDetails] = useState(null);
    const [userDetails, setUserDetails] = useUserStore(state => [state.userDetailsStore, state.updateUserDetails])


    async function fetchEvents() {
        try {
            let res = await axios.post(getMyEvents, { userId: userDetails._id })
            console.log(res.data, "My events")
            setEvents(res.data)
            setLoading(false)
            // setProjects(res.data)
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        fetchEvents();
    }, []);

    const handleViewEvent = (event) => {
        setSelectedEvent(event);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                My Registered Events
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : events.length === 0 ? (
                <Typography variant="h6" textAlign="center" color="textSecondary">
                    No registered events yet
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {events.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
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

            {selectedEvent && (
                <EventView
                    open={!!selectedEvent}
                    setOpen={() => setSelectedEvent(null)}
                    item={selectedEvent}
                    userDetails={userDetails}
                    showScheduleOptions={false}
                />
            )}
        </Box>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page; 