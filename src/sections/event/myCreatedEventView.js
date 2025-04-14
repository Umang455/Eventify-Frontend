"use client";

import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Typography,
    CircularProgress,
    TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import { baseUrl, registerEventAPI } from "src/config/api";
import { useState, useEffect } from "react";

export const MyCreatedEventView = ({ open, setOpen, item, userDetails }) => {
    const [schedule, setSchedule] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    useEffect(() => {
        // If there's a saved schedule, load it
        if (item?.savedSchedule) {
            setSchedule(item.savedSchedule);
            setHasGenerated(true);
        }
    }, [item]);

    const handleRegister = async () => {
        if (userDetails?.registeredEvents?.includes(item._id)) {
            toast.info("You are already registered for this event!");
            return;
        }

        if (window.confirm("Are you sure you want to register for this event?")) {
            try {
                await axios.post(registerEventAPI(item._id), { userId: userDetails._id });
                toast.success("Thank you for registering!");
                setOpen(false);
            } catch (error) {
                toast.error("Already Registered");
                setOpen(false)
            }
        }
    };

    const generateSchedule = async () => {
        try {
            setLoading(true);
            const response = await axios.post(baseUrl + `events/generate-schedule/${item._id}`, {
                userId: userDetails._id
            });
            setSchedule(response.data.schedule);
            setIsEditing(true);
            setHasGenerated(true);
            toast.success("Schedule generated successfully!");
        } catch (error) {
            console.error("Error generating schedule:", error);
            toast.error(error.response?.data?.message || "Failed to generate schedule");
        } finally {
            setLoading(false);
        }
    };

    const saveSchedule = async () => {
        try {
            setLoading(true);
            await axios.post(baseUrl + `events/save-schedule/${item._id}`, {
                userId: userDetails._id,
                schedule: schedule
            });
            setIsEditing(false);
            toast.success("Schedule saved successfully!");
        } catch (error) {
            console.error("Error saving schedule:", error);
            toast.error(error.response?.data?.message || "Failed to save schedule");
        } finally {
            setLoading(false);
        }
    };

    const editSchedule = () => {
        setIsEditing(true);
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#6366F1",
                    color: "#fff",
                    alignItems: "center",
                    height: 60,
                    padding: "20px 50px",
                }}
            >
                <Typography variant="h6" color="inherit">
                    Event Details
                </Typography>
                <Button sx={{ color: "#fff" }} onClick={() => setOpen(false)}>
                    Close
                </Button>
            </DialogTitle>
            <DialogContent>
                <Card elevation={4} sx={{ borderRadius: 3, overflow: "hidden", mt: 2 }}>
                    <CardContent>
                        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
                            {item?.eventName}
                        </Typography>
                        <Divider />
                        <Grid container spacing={2} mt={2}>
                            {[
                                { label: "Event Type", value: item?.eventType },
                                { label: "Event Time", value: moment(item?.eventTime).format("LLLL") },
                                { label: "Venue", value: item?.venue },
                                { label: "Theme", value: item?.theme },
                                { label: "Budget", value: `${item?.budget}` },
                                { label: "Attendees", value: item?.people },
                                { label: "Duration", value: item?.eventDuration },
                                { label: "Created By", value: item?.createdBy?.name || "N/A" },
                            ].map((detail, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {detail.label}
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500">
                                        {detail.value || "N/A"}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>

                        <Box mt={3}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Description
                            </Typography>
                            <Typography variant="body1">{item?.description}</Typography>
                        </Box>

                        <Box mt={3}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={generateSchedule}
                                disabled={loading}
                                sx={{ mb: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : hasGenerated ? "Regenerate Schedule" : "Generate Schedule"}
                            </Button>

                            <Box mt={2}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Schedule
                                </Typography>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={10}
                                        value={schedule}
                                        onChange={(e) => setSchedule(e.target.value)}
                                        variant="outlined"
                                    />
                                ) : (
                                    <Card variant="outlined" sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: 'monospace',
                                                fontSize: '0.9rem',
                                                lineHeight: 1.5,
                                                color: '#333'
                                            }}
                                        >
                                            {schedule || "No schedule available"}
                                        </Typography>
                                    </Card>
                                )}
                            </Box>

                            <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                                {!item?.savedSchedule && schedule && !isEditing && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={saveSchedule}
                                        disabled={loading}
                                    >
                                        Save Schedule
                                    </Button>
                                )}
                                {item?.savedSchedule && !isEditing && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={editSchedule}
                                        disabled={loading}
                                    >
                                        Edit Schedule
                                    </Button>
                                )}
                                {isEditing && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={saveSchedule}
                                        disabled={loading}
                                    >
                                        Save Schedule
                                    </Button>
                                )}
                            </Box>
                        </Box>

                        <Box mt={4} display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleRegister}
                                disabled={userDetails?.registeredEvents?.includes(item?._id)}
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {userDetails?.registeredEvents?.includes(item?._id) ? "Registered" : "Register"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}; 