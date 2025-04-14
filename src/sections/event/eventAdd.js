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
import React, { useState, useRef } from "react";
import { generateEvents, createEvent } from "src/config/api"; // Ensure you have createEvent API
import { addEvents } from "../../config/api";
import { toast } from "react-toastify";
import { useUserStore } from "src/store/useStore";

export const EventAdd = (props) => {
    const { open, setOpen, fetchEvents, userDetails } = props;

    // Form State
    const [eventName, setEventName] = useState("");
    const [eventType, setEventType] = useState("");
    const [description, setDescription] = useState("");
    const [people, setPeople] = useState("");
    const [budget, setBudget] = useState("");
    const [location, setLocation] = useState("");
    const [catering, setCatering] = useState(false);
    const [eventTime, setEventTime] = useState(null);
    const [eventDuration, setEventDuration] = useState("");
    const [bannerImage, setBannerImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const fileInputRef = useRef(null);

    // Event Options & Loading
    const [eventOptions, setEventOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null); // To track selected event

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setBannerImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    // Generate Event Ideas
    const handleGenerateEvents = async () => {
        // Format budget with currency symbol if it's a number
        const formattedBudget = budget ? `₹${Number(budget).toLocaleString('en-IN')}` : 'Not specified';

        const prompt = `Create an event with the following details: 
        Name: ${eventName || 'Not specified'}, 
        Type: ${eventType || 'Not specified'}, 
        Description: ${description || 'Not specified'}, 
        Location: ${location || 'Not specified'}, 
        Catering: ${catering ? "Yes" : "No"}, 
        Time: ${eventTime ? new Date(eventTime).toLocaleString() : 'Not specified'}, 
        Duration: ${eventDuration || 'Not specified'} hours,
        Budget: ${formattedBudget},
        Number of People: ${people || 'Not specified'}.`;

        let data = {
            eventName,
            eventType,
            budget: formattedBudget,
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
            toast.error("Error generating event options. Please try again.");
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
            toast.error("Please select an event option first!");
            return;
        }

        // Validate required fields
        if (!eventName || !location || !eventTime) {
            toast.error("Please fill in all required fields: Event Name, Location, and Event Time");
            return;
        }

        try {
            setLoading(true);
            let formData = new FormData();

            // Format eventTime to ISO string
            const formattedEventTime = eventTime ? new Date(eventTime).toISOString() : null;

            // Append all event data
            formData.append('eventName', eventName);
            formData.append('eventType', eventType);
            formData.append('description', description);
            formData.append('location', location);
            formData.append('catering', catering);
            formData.append('budget', budget);
            formData.append('eventTime', formattedEventTime);
            formData.append('eventDuration', eventDuration);
            formData.append('people', people);
            formData.append('createdBy', userDetails._id);

            // Append selected event details
            Object.keys(selectedEvent).forEach(key => {
                formData.append(key, selectedEvent[key]);
            });

            // Append banner image if exists
            if (bannerImage) {
                formData.append('bannerImage', bannerImage);
            }

            let res = await axios.post(addEvents, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("Event Created Successfully:", res.data);
            toast.success("Event Added Successfully");
            setOpen(false);
            if (fetchEvents) {
                fetchEvents();
            }
        } catch (error) {
            console.error("Error creating event:", error);
            const errorMessage = error.response?.data?.message || "Error creating event. Please try again.";
            toast.error(errorMessage);
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
                            {/* Banner Image Upload */}
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        border: '2px dashed #ccc',
                                        borderRadius: 2,
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            borderColor: '#6366F1',
                                        },
                                    }}
                                    onClick={handleImageClick}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Banner Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                objectFit: 'contain',
                                            }}
                                        />
                                    ) : (
                                        <Typography>Click to upload banner image</Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField label="Event Name" fullWidth variant="filled" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField label="Budget" fullWidth variant="filled" value={budget} onChange={(e) => setBudget(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={4}>
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
