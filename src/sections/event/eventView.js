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
} from "@mui/material";
import { motion } from "framer-motion";
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import { registerEventAPI } from "src/config/api";

export const EventView = ({ open, setOpen, item, userDetails }) => {
    if (!item) return null;

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

    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle
                component={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#6366F1",
                    color: "#fff",
                    alignItems: "center",
                    height: 60,
                    padding: "20px 50px",
                }}
            >
                <Typography variant="h6">Event Details</Typography>
                <Button sx={{ color: "#fff" }} onClick={() => setOpen(false)}>
                    Close
                </Button>
            </DialogTitle>

            <DialogContent
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    elevation={4}
                    sx={{ borderRadius: 3, overflow: "hidden", mt: 2 }}
                >
                    <CardContent>
                        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
                            {item.eventName}
                        </Typography>
                        <Divider />
                        <Grid container spacing={2} mt={2}>
                            {[
                                { label: "Event Type", value: item.eventType },
                                { label: "Event Time", value: moment(item.eventTime).format("LLLL") },
                                { label: "Venue", value: item.venue },
                                { label: "Theme", value: item.theme },
                                { label: "Budget", value: `$${item.budget}` },
                                { label: "Attendees", value: item.people },
                                { label: "Duration", value: item.eventDuration },
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
                            <Typography variant="body1">{item.description}</Typography>
                        </Box>

                        <Box mt={4} display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleRegister}
                                disabled={userDetails?.registeredEvents?.includes(item._id)}
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {userDetails?.registeredEvents?.includes(item._id) ? "Registered" : "Register"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};
