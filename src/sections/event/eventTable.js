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

export const EventTable = ({ items = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedSnippet, setSelectedSnippet] = useState(null);

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
            <Grid container spacing={2}>
                {data.map((data, index) => (
                    <Grid item xs={12} md={6} lg={4} key={data._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{data.eventName}</Typography>
                                <Typography color="textSecondary">{data.eventType}</Typography>
                                <Typography>{moment(data.eventTime).format("LLL")}</Typography>
                                <Typography color="textSecondary">{data.venue}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <IconButton
                                        onClick={() => {
                                            setOpenViewModal(true);
                                            setSelectedSnippet(data);
                                        }}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    <input
                                        type="file"
                                        accept=".csv, .xlsx"
                                        style={{ display: "none" }}
                                        id={`upload-${data._id}`}
                                        onChange={(e) => handleUpload(data._id, e.target.files[0])}
                                    />
                                    <label htmlFor={`upload-${data._id}`}>
                                        <IconButton component="span">
                                            <UploadFileIcon />
                                        </IconButton>
                                    </label>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <EventView open={openViewModal} setOpen={setOpenViewModal} item={selectedSnippet} />
        </>
    );
};
