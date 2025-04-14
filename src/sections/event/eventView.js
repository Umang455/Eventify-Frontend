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
    CardMedia,
} from "@mui/material";
import { motion } from "framer-motion";
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import { baseUrl, registerEventAPI } from "src/config/api";
import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { InvitationStyleDialog } from './InvitationStyleDialog';

export const EventView = ({ open, setOpen, item, userDetails, showScheduleOptions }) => {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const isCreator = item?.createdBy?._id === userDetails?._id;
    const pdfRef = useRef();
    const [showInvitationDialog, setShowInvitationDialog] = useState(false);

    console.log(showScheduleOptions, "show in my");
    useEffect(() => {
        // If there's a saved schedule, load it
        if (item?.savedSchedule?.scheduleOptions) {
            setSchedule(item.savedSchedule.scheduleOptions.join('\n\n'));
            setSelectedOption(item.savedSchedule.selectedOption || 1);
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
            setSelectedOption(1);
            setIsEditing(true);
            toast.success("Schedule options generated successfully!");
        } catch (error) {
            console.error("Error generating schedule:", error);
            toast.error(error.response?.data?.message || "Failed to generate schedule options");
        } finally {
            setLoading(false);
        }
    };

    const saveSchedule = async () => {
        try {
            setLoading(true);
            const options = schedule.split('Option').filter(option => option.trim());
            await axios.post(baseUrl + `events/save-schedule/${item._id}`, {
                userId: userDetails._id,
                selectedOption,
                scheduleOptions: options.map(opt => opt.replace(/^\d+:/, '').trim())
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

    const renderScheduleOptions = () => {
        if (!schedule) return null;

        const options = schedule.split('Option').filter(option => option.trim());

        return (
            <Box mt={2}>
                <Box mb={2} display="flex" gap={1}>
                    {options.map((_, index) => (
                        <Button
                            key={index + 1}
                            variant={selectedOption === index + 1 ? "contained" : "outlined"}
                            color="primary"
                            size="small"
                            onClick={() => setSelectedOption(index + 1)}
                        >
                            Option {index + 1}
                        </Button>
                    ))}
                </Box>
                <Card variant="outlined" sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                    {isEditing ? (
                        <TextField
                            fullWidth
                            multiline
                            rows={10}
                            value={options[selectedOption - 1]?.replace(`${selectedOption}:`, '').trim()}
                            onChange={(e) => {
                                const newOptions = [...options];
                                newOptions[selectedOption - 1] = `Option ${selectedOption}: ${e.target.value}`;
                                setSchedule(newOptions.join('\n\n'));
                            }}
                            variant="outlined"
                        />
                    ) : (
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
                            {options[selectedOption - 1]?.replace(`${selectedOption}:`, '').trim()}
                        </Typography>
                    )}
                </Card>
                {showScheduleOptions && (
                    <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                        {!item.savedSchedule && schedule && !isEditing && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={saveSchedule}
                                disabled={loading}
                            >
                                Save Schedule
                            </Button>
                        )}
                        {item.savedSchedule && !isEditing && (
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
                                Save Changes
                            </Button>
                        )}
                    </Box>
                )}
            </Box>
        );
    };

    const generatePDF = async (style) => {
        try {
            // Generate the HTML content using the template function
            const html = style.template(item);

            // Create and style the temporary div
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // ✅ Style to match A4 size and avoid white space
            tempDiv.style.width = '794px'; // A4 width in pixels at 96 DPI
            tempDiv.style.height = '1123px'; // A4 height in pixels at 96 DPI
            tempDiv.style.position = 'absolute';
            tempDiv.style.top = '0';
            tempDiv.style.left = '0';
            tempDiv.style.backgroundColor = '#ffffff'; // Solid white background
            tempDiv.style.padding = '0';
            tempDiv.style.margin = '0';
            tempDiv.style.zIndex = '-1'; // Hidden from user view

            document.body.appendChild(tempDiv);

            // Generate canvas from the div
            const canvas = await html2canvas(tempDiv, {
                scale: 2,        // Higher resolution
                useCORS: true,   // In case of external assets
                logging: false,
            });

            // Clean up
            document.body.removeChild(tempDiv);

            // Convert to image and add to PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${item.eventName}_invitation.pdf`);
            toast.success('Invitation PDF generated successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF');
        }
    };


    const handleGenerateInvite = () => {
        setShowInvitationDialog(true);
    };

    const handleStyleSelect = (style) => {
        setShowInvitationDialog(false);
        generatePDF(style);
    };

    return (
        <>
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
                    <div ref={pdfRef} style={{ padding: '20px', background: '#f8f9fa' }}>
                        <Card elevation={4} sx={{ borderRadius: 3, overflow: "hidden", mt: 2 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={baseUrl + `${item?.bannerImage}`}
                                alt={item?.eventName}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ background: '#fff' }}>
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    textAlign="center"
                                    mb={2}
                                    sx={{
                                        color: '#6366F1',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    {item?.eventName}
                                </Typography>
                                <Divider sx={{ mb: 3, borderColor: '#6366F1' }} />
                                <Grid container spacing={3} mt={2}>
                                    {[
                                        { label: "Event Type", value: item?.eventType, icon: "🎉" },
                                        { label: "Event Time", value: moment(item?.eventTime).format("LLLL"), icon: "⏰" },
                                        { label: "Venue", value: item?.venue, icon: "📍" },
                                        { label: "Theme", value: item?.theme, icon: "🎨" },
                                        { label: "Budget", value: `${item?.budget}`, icon: "💰" },
                                        { label: "Attendees", value: item?.people, icon: "👥" },
                                        { label: "Duration", value: item?.eventDuration, icon: "⏳" },
                                        { label: "Created By", value: item?.createdBy?.name || "N/A", icon: "👤" },
                                    ].map((detail, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <Box sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                background: '#f8f9fa',
                                                border: '1px solid #e9ecef',
                                                '&:hover': {
                                                    background: '#e9ecef',
                                                    transition: 'all 0.3s ease'
                                                }
                                            }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <span>{detail.icon}</span>
                                                    {detail.label}
                                                </Typography>
                                                <Typography variant="body1" fontWeight="500" sx={{ mt: 1 }}>
                                                    {detail.value || "N/A"}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Box mt={4} sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    background: '#f8f9fa',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <Typography variant="h6" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        📝 Description
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        lineHeight: 1.6,
                                        color: '#495057'
                                    }}>
                                        {item?.description}
                                    </Typography>
                                </Box>

                                <Box mt={3}>
                                    {showScheduleOptions && !item.savedSchedule && (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={generateSchedule}
                                            disabled={loading}
                                            sx={{ mb: 2 }}
                                        >
                                            {loading ? <CircularProgress size={24} /> : "Generate Schedule Options"}
                                        </Button>
                                    )}
                                    {(schedule || item?.savedSchedule) && renderScheduleOptions()}
                                </Box>

                                {item?.savedSchedule && (
                                    <Box mt={3}>
                                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                            Schedule
                                        </Typography>
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
                                                {item.savedSchedule}
                                            </Typography>
                                        </Card>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Box mt={4} display="flex" justifyContent="center" gap={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGenerateInvite}
                            component={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            startIcon={<span>📄</span>}
                        >
                            Generate Invite
                        </Button>
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
                </DialogContent>
            </Dialog>

            <InvitationStyleDialog
                open={showInvitationDialog}
                onClose={() => setShowInvitationDialog(false)}
                onSelect={handleStyleSelect}
                item={item}
            />
        </>
    );
};
