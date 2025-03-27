import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import React from "react";
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import { registerEventAPI } from "src/config/api";
import { useUserStore } from "src/store/useStore";

export const EventView = ({ open, setOpen, item, getData }) => {
    if (!item) {
        return null;
    }
    const [userDetails, setUserDetails] = useUserStore(state => [state.userDetailsStore, state.updateUserDetails])

    const handleRegister = async () => {
        if (userDetails?.registeredEvents?.includes(item._id)) {
            toast.info('You are already registered for this event!');
            return;
        }

        if (window.confirm('Are you sure you want to register for this event?')) {
            try {
                await axios.post(registerEventAPI(item._id), { userId: userDetails._id });
                toast.success('Thank you for registering!');
                // getData();
                setOpen(false);
            } catch (error) {
                toast.error('Failed to register. Please try again.');
            }
        }
    };

    const {
        eventName,
        eventType,
        description,
        location,
        people,
        eventTime,
        eventDuration,
        venue,
        theme,
        budget,
        activities,
        decoration,
    } = item;

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
            <DialogTitle
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
                <Typography color="textPrimary" sx={{ color: "#fff" }} variant="h6">
                    Event Details
                </Typography>
                <Box>
                    <Button sx={{ color: "#fff" }} onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box padding={2}>
                    <Typography sx={{ fontSize: 20 }}>Event Details</Typography>
                    <Divider />
                    <Grid container marginTop={2} spacing={3}>
                        {[{ label: "Event Name", value: eventName },
                        { label: "Event Type", value: eventType },
                        { label: "Description", value: description, multiline: true, rows: 4 },
                        { label: "Location", value: location },
                        { label: "People", value: people },
                        { label: "Event Time", value: eventTime ? moment(eventTime).format('LLLL') : "" },
                        { label: "Event Duration", value: eventDuration },
                        { label: "Venue", value: venue },
                        { label: "Theme", value: theme },
                        { label: "Budget", value: budget },
                        { label: "Activities", value: activities },
                        { label: "Decoration", value: decoration },].map((field, index) => (
                            <Grid item md={6} xs={12} key={index}>
                                <TextField
                                    label={field.label}
                                    variant="filled"
                                    fullWidth
                                    value={field.value || ""}
                                    InputProps={{ readOnly: true }}
                                    multiline={field.multiline}
                                    rows={field.rows}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Box mt={4} display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRegister}
                            disabled={userDetails?.registeredEvents?.includes(item._id)}
                        >
                            {userDetails?.registeredEvents?.includes(item._id) ? "Registered" : "Register"}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
