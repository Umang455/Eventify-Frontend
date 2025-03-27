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
    FormControlLabel,
    Checkbox,
    Card,
    CardContent,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import React, { useState } from "react";
import { generateEvents, createEvent } from "src/config/api"; // Ensure you have createEvent API
import { addEvents } from "../../config/api";
import { toast } from "react-toastify";
import { useUserStore } from "src/store/useStore";

export const EventAdd = (props) => {
    const { open, setOpen } = props;

    // Form State
    const [eventName, setEventName] = useState("");
    const [eventType, setEventType] = useState("");
    const [description, setDescription] = useState("");
    const [people, setPeople] = useState("");
    const [location, setLocation] = useState("");
    const [catering, setCatering] = useState(false);
    const [eventTime, setEventTime] = useState(null);
    const [eventDuration, setEventDuration] = useState("");
    const [userDetails, setUserDetails] = useUserStore(state => [state.userDetailsStore, state.updateUserDetails])

    // Event Options & Loading
    const [eventOptions, setEventOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null); // To track selected event

    // Generate Event Ideas
    const handleGenerateEvents = async () => {
        const prompt = `Create an event with the following details: Name: ${eventName}, Type: ${eventType}, Description: ${description}, Location: ${location}, Catering: ${catering ? "Yes" : "No"}, Time: ${eventTime}, Duration: ${eventDuration} hours.`;

        let data = {
            eventName,
            eventType,
            description,
            location,
            catering,
            eventTime,
            prompt
        };

        try {
            setLoading(true);
            let res = await axios.post(generateEvents, data);
            setEventOptions(res.data);
        } catch (error) {
            console.error("Error generating events:", error);
        } finally {
            setLoading(false);
        }
    };

    // Select an event option
    const handleSelectEvent = (index) => {
        setSelectedEvent(eventOptions[index]);
    };

    // Final Submission
    const handleCreateEvent = async () => {
        if (!selectedEvent) {
            alert("Please select an event option first!");
            return;
        }

        // Merging form details with selected event
        const finalEventData = {
            eventName,
            eventType,
            description,
            location,
            cateringReq: catering,
            eventTime,
            eventDuration,
            people,
            createdBy: userDetails.name,
            createdById: userDetails._id,
            ...selectedEvent // Adds theme, activities, venue, decoration
        };

        console.log("finalEventData", finalEventData)
        // return
        try {
            setLoading(true);
            let res = await axios.post(addEvents, finalEventData);
            console.log("Event Created Successfully:", res.data);
            toast.success("Added Successfully")
            setOpen(false); // Close dialog
        } catch (error) {
            console.error("Error creating event:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Fullscreen Loader */}
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: 2000 }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Event Form Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
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
                        Add Event
                    </Typography>
                    <Box>
                        <Button sx={{ color: "#fff" }} onClick={() => setOpen(false)}>
                            Close
                        </Button>
                        <Button sx={{ color: "#fff" }} onClick={handleCreateEvent}>
                            Save
                        </Button>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Box padding={2}>
                        <Typography sx={{ fontSize: 20 }}>Event Details</Typography>
                        <Divider />

                        <Grid container marginTop={1} spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField label="Event Name" fullWidth variant="filled" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Event Type" fullWidth variant="filled" value={eventType} onChange={(e) => setEventType(e.target.value)} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Description" fullWidth variant="filled" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Number of People" type="number" fullWidth variant="filled" value={people} onChange={(e) => setPeople(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Location" fullWidth variant="filled" value={location} onChange={(e) => setLocation(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker label="Event Time" value={eventTime} onChange={(newValue) => setEventTime(newValue)} renderInput={(params) => <TextField {...params} fullWidth variant="filled" />} />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Event Duration (in hours)" type="number" fullWidth variant="filled" value={eventDuration} onChange={(e) => setEventDuration(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControlLabel control={<Checkbox checked={catering} onChange={(e) => setCatering(e.target.checked)} />} label="Catering Required" />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button sx={{ bgcolor: '#d3d3d3', width: '100%', color: 'black' }} onClick={handleGenerateEvents}>
                                    {eventOptions.length === 0 ? "Generate" : "Re-generate"}
                                </Button>
                            </Grid>
                        </Grid>

                        {/* Event Options Grid */}
                        <Grid container spacing={3} mt={2} justifyContent="center">
                            {eventOptions.map((e, i) => (
                                <Grid item key={i} md={4} sm={6} xs={12}>
                                    <Card
                                        sx={{
                                            backgroundColor: selectedEvent === e ? '#FFD700' : '#f5f5f5',
                                            borderRadius: 3,
                                            boxShadow: 3,
                                            transition: '0.3s',
                                            '&:hover': { boxShadow: 6, cursor: 'pointer' },
                                        }}
                                        onClick={() => handleSelectEvent(i)}
                                    >
                                        <CardContent sx={{ padding: '20px', textAlign: 'center' }}>
                                            <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
                                                Option {i + 1}
                                            </Typography>
                                            <Typography variant="body1"><strong>Theme:</strong> {e.theme}</Typography>
                                            <Typography variant="body1"><strong>People:</strong> {e.people}</Typography>
                                            <Typography variant="body1"><strong>Venue:</strong> {e['venue']}</Typography>
                                            <Typography variant="body1"><strong>Activities:</strong> {e.activities}</Typography>
                                            <Typography variant="body1"><strong>Decoration:</strong> {e.decoration}</Typography>
                                            <Typography variant="body1"><strong>Budget:</strong> {e.budget}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};
