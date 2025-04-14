import { Dialog, DialogTitle, DialogContent, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import moment from "moment";
import { baseUrl } from "src/config/api";

const invitationStyles = [
    {
        id: 1,
        name: "Classic",
        description: "Elegant and traditional design with a formal layout",
        preview: "🎭",
        template: (item) => `
            <div style="
                font-family: 'Times New Roman', serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 15px;
                background: #ffffff;
                border: 1px solid #e0e0e0;
            ">
                <div style="text-align: center; margin-bottom: 15px;">
                    <h1 style="
                        color: #2c3e50;
                        font-size: 26px;
                        margin: 0;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    ">${item?.eventName}</h1>
                    <p style="color: #7f8c8d; margin: 8px 0;">You are cordially invited to</p>
                </div>
                <div style="
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                    margin-bottom: 15px;
                ">
                    ${[
                { label: "Event Type", value: item?.eventType, icon: "🎉" },
                { label: "Date & Time", value: moment(item?.eventTime).format("LLLL"), icon: "📅" },
                { label: "Venue", value: item?.venue, icon: "📍" },
                { label: "Theme", value: item?.theme || "Smart Casual", icon: "🎨" },
                { label: "Budget", value: `${item?.budget}`, icon: "💰" },
                { label: "Attendees", value: item?.people, icon: "👥" },
                { label: "Duration", value: item?.eventDuration, icon: "⏳" },
                { label: "Created By", value: item?.createdBy?.name || "N/A", icon: "👤" }
            ].map(detail => `
                        <div style="
                            background: #f8f9fa;
                            padding: 8px;
                            border-radius: 4px;
                            border: 1px solid #e9ecef;
                        ">
                            <div style="color: #6c757d; font-size: 12px; margin-bottom: 2px;">
                                ${detail.icon} ${detail.label}
                            </div>
                            <div style="color: #212529; font-size: 14px; font-weight: 500;">
                                ${detail.value || "N/A"}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 4px;
                    border: 1px solid #e9ecef;
                    margin-bottom: 15px;
                ">
                    <h2 style="color: #6c757d; font-size: 14px; margin: 0 0 8px 0;">
                        📝 Description
                    </h2>
                    <p style="color: #495057; line-height: 1.4; margin: 0; font-size: 13px;">
                        ${item?.description}
                    </p>
                </div>
                <div style="text-align: center; margin-top: 12px; color: #6c757d; font-size: 12px;">
                    We look forward to your presence
                </div>
            </div>
        `
    },
    {
        id: 2,
        name: "Modern",
        description: "Clean and contemporary design with bold typography",
        preview: "🎨",
        template: (item) => `
            <div style="
                font-family: 'Helvetica Neue', sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 15px;
                background: #ffffff;
            ">
                <div style="text-align: center; margin-bottom: 15px;">
                    <h1 style="
                        color: #6366F1;
                        font-size: 28px;
                        margin: 0;
                        font-weight: 700;
                    ">${item?.eventName}</h1>
                    <p style="color: #6c757d; margin: 8px 0; font-size: 15px;">Join us for an unforgettable experience</p>
                </div>
                <div style="
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                    margin-bottom: 15px;
                ">
                    ${[
                { label: "Event Type", value: item?.eventType, icon: "🎉" },
                { label: "When", value: moment(item?.eventTime).format("LLLL"), icon: "⏰" },
                { label: "Where", value: item?.venue, icon: "📍" },
                { label: "Theme", value: item?.theme || "Casual", icon: "🎭" },
                { label: "Budget", value: `${item?.budget}`, icon: "💰" },
                { label: "Attendees", value: item?.people, icon: "👥" },
                { label: "Duration", value: item?.eventDuration, icon: "⏳" },
                { label: "Created By", value: item?.createdBy?.name || "N/A", icon: "👤" }
            ].map(detail => `
                        <div style="
                            background: #f8f9fa;
                            padding: 10px;
                            border-radius: 8px;
                            border: 1px solid #e9ecef;
                        ">
                            <div style="color: #6366F1; font-size: 13px; margin-bottom: 3px; font-weight: 600;">
                                ${detail.icon} ${detail.label}
                            </div>
                            <div style="color: #212529; font-size: 14px;">
                                ${detail.value || "N/A"}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid #e9ecef;
                    margin-bottom: 15px;
                ">
                    <h2 style="color: #6366F1; font-size: 16px; margin: 0 0 8px 0;">
                        📝 Description
                    </h2>
                    <p style="color: #495057; line-height: 1.5; margin: 0; font-size: 14px;">
                        ${item?.description}
                    </p>
                </div>
                <div style="text-align: center; margin-top: 12px; color: #6c757d; font-size: 13px;">
                    Don't miss out on this amazing event!
                </div>
            </div>
        `
    },
    {
        id: 3,
        name: "Minimalist",
        description: "Simple and elegant design with focus on essential information",
        preview: "🎯",
        template: (item) => `
            <div style="
                font-family: 'Arial', sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 15px;
                background: #ffffff;
            ">
                <div style="text-align: center; margin-bottom: 15px;">
                    <h1 style="
                        color: #2c3e50;
                        font-size: 24px;
                        margin: 0;
                        font-weight: 400;
                        letter-spacing: 1px;
                    ">${item?.eventName}</h1>
                    <div style="height: 1px; background: #e0e0e0; margin: 12px 0;"></div>
                </div>
                <div style="
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                    margin-bottom: 15px;
                ">
                    ${[
                { label: "Event Type", value: item?.eventType, icon: "🎉" },
                { label: "Date", value: moment(item?.eventTime).format("LL"), icon: "📅" },
                { label: "Time", value: moment(item?.eventTime).format("LT"), icon: "⏰" },
                { label: "Location", value: item?.venue, icon: "📍" },
                { label: "Theme", value: item?.theme || "Casual", icon: "🎭" },
                { label: "Budget", value: `${item?.budget}`, icon: "💰" },
                { label: "Attendees", value: item?.people, icon: "👥" },
                { label: "Duration", value: item?.eventDuration, icon: "⏳" }
            ].map(detail => `
                        <div style="
                            padding: 8px;
                            border-bottom: 1px solid #e0e0e0;
                        ">
                            <div style="color: #95a5a6; font-size: 11px; margin-bottom: 2px;">
                                ${detail.icon} ${detail.label}
                            </div>
                            <div style="color: #2c3e50; font-size: 13px;">
                                ${detail.value || "N/A"}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="
                    padding: 12px;
                    border-top: 1px solid #e0e0e0;
                    margin-bottom: 15px;
                ">
                    <h2 style="color: #95a5a6; font-size: 13px; margin: 0 0 8px 0;">
                        📝 Description
                    </h2>
                    <p style="color: #2c3e50; line-height: 1.4; margin: 0; font-size: 13px;">
                        ${item?.description}
                    </p>
                </div>
                <div style="text-align: center; margin-top: 12px; color: #95a5a6; font-size: 11px;">
                    We hope to see you there
                </div>
            </div>
        `
    }
];

export const InvitationStyleDialog = ({ open, onClose, onSelect, item }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Select Invitation Style</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {invitationStyles.map((style) => (
                        <Grid item xs={12} sm={4} key={style.id}>
                            <Card
                                component={motion.div}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => onSelect(style)}
                                sx={{
                                    cursor: 'pointer',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h4" align="center" sx={{ mb: 2 }}>
                                        {style.preview}
                                    </Typography>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        {style.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        {style.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
        </Dialog>
    );
}; 