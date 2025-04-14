import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { baseUrl } from "src/config/api";
import * as XLSX from 'xlsx';

export const ExcelUpload = (props) => {
    const { open, setOpen, eventId } = props;
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            const reader = new FileReader();

            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                // Process the data and send to backend
                const invitations = jsonData.map(row => ({
                    name: row['Name'] || row['name'],
                    email: row['Email'] || row['email']
                }));

                // Send to backend
                const response = await fetch(`${baseUrl}events/invite/${eventId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ invitations }),
                });

                if (!response.ok) {
                    throw new Error('Failed to send invitations');
                }

                toast.success('Invitations sent successfully');
                setOpen(false);
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error processing Excel file:', error);
            toast.error('Error sending invitations');
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: 2000 }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        background: "#6366F1",
                        color: "#fff",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" color="inherit">
                        Upload User List via Excel
                    </Typography>
                    <Button sx={{ color: "#fff" }} onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogTitle>

                <DialogContent>
                    <Box padding={2}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Upload an Excel file containing user details. The file should have the following columns:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Name, Email
                        </Typography>

                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClick}
                            fullWidth
                        >
                            Select Excel File
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}; 