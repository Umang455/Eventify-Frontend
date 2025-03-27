import { Box, Card, CardContent, IconButton, InputAdornment, OutlinedInput, SvgIcon, Typography, Grid } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { useState } from "react";
import _ from "lodash";
import axios from "axios";
import { inviteEventAPI } from "src/config/api";
import { toast } from "react-toastify";
import moment from "moment";
import { EventView } from "./eventView";
import { useUserStore } from "src/store/useStore";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";

export const MyEventTable = ({ items = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedSnippet, setSelectedSnippet] = useState(null);
    const [userDetails, setUserDetails] = useUserStore(state => [state.userDetailsStore, state.updateUserDetails]);

    let data = items;
    if (searchTerm !== "") {
        data = _.filter(data, (i) => i.eventName?.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    const handleUpload = async (eventId, file) => {
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(sheet);

                if (parsedData.length === 0) {
                    toast.error("No data found in the file.");
                    return;
                }

                const invitations = parsedData.map(row => ({
                    name: row.Name,
                    email: row.Email
                }));

                await axios.post(inviteEventAPI(eventId), { invitations });
                toast.success("Invitations sent successfully");
            };
            reader.readAsArrayBuffer(file);

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error(error);
            toast.error("Failed to send invitations");
        }
    };

    return (
        <>
            <Card sx={{ p: 2, mb: 2 }}>
                <OutlinedInput
                    fullWidth
                    placeholder="Search Events"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startAdornment={
                        <InputAdornment position="start">
                            <SvgIcon color="action" fontSize="small">
                                <MagnifyingGlassIcon />
                            </SvgIcon>
                        </InputAdornment>
                    }
                    sx={{ maxWidth: 500 }}
                />
            </Card>
            <Grid container spacing={2} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {data.map((event, index) => (
                    <Grid
                        item xs={12} md={6} lg={4} key={event._id}
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">{event.eventName}</Typography>
                                    <Typography color="textSecondary">{event.eventType}</Typography>
                                    <Typography>{moment(event.eventTime).format("LLL")}</Typography>
                                    <Typography color="textSecondary">{event.venue}</Typography>
                                </CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                                    <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                                        <IconButton
                                            onClick={() => {
                                                setOpenViewModal(true);
                                                setSelectedSnippet(event);
                                            }}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </motion.div>
                                    <input
                                        type="file"
                                        accept=".csv, .xlsx"
                                        style={{ display: "none" }}
                                        id={`upload-${event._id}`}
                                        onChange={(e) => handleUpload(event._id, e.target.files[0])}
                                    />
                                    <motion.label whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }} htmlFor={`upload-${event._id}`}>
                                        <IconButton component="span">
                                            <UploadFileIcon />
                                        </IconButton>
                                    </motion.label>
                                </Box>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
            <EventView open={openViewModal} setOpen={setOpenViewModal} item={selectedSnippet} userDetails={userDetails} />
        </>
    );
};
