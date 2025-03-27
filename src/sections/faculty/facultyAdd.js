import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import { DesktopDatePicker, DesktopDateTimePicker, MobileDatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import ReactQuill from 'react-quill'
import { toast } from "react-toastify";
import { addProjectCommunicationAPI, getAllProjectsAPI, getSystemUsers, registerUser } from "src/config/api";
import { _isValidEmail } from "src/utils/common";
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { getDateRangePickerDayUtilityClass } from "@mui/lab";

export const FacultyAdd = (props) => {
    const { open, setOpen, getData } = props;

    //fields for Communication Snippet

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    useEffect(() => {

    }, []);

    async function _getProjects() {
        try {
            let res = await axios.get(getAllProjectsAPI);
            console.log(res.data);
            // setProjects(res.data);
        } catch (e) {
            console.log(e);
        }
    }


    async function _onSave() {
        try {
            let data = {
                name,
                phone,
                email,
                // password: "111111",

            }
            let res = await axios.post(registerUser, data)
            console.log(res.data, "ressss?>>")
            getData()
            setOpen(false)
        } catch (e) {
            console.log(e);
        }
        // console.log(communicationWith,from)
    }

    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
                <DialogTitle
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        background: "#6366F1",
                        color: "#fff",
                        alignItems: "center",
                        height: 60,
                        padding: "20px",
                        paddingLeft: "50px",
                        paddingRight: "50px",
                    }}
                >
                    <Typography color="textPrimary" style={{ color: "#fff" }} variant="h6">
                        Add User
                    </Typography>
                    <Box>
                        <Button sx={{ color: "#fff" }} onClick={() => setOpen(false)}>
                            Close
                        </Button>
                        <Button sx={{ color: "#fff" }} onClick={() => _onSave()}>
                            Save
                        </Button>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box padding={2}>
                        <Typography sx={{ fontSize: 20 }}>User Details</Typography>
                        <Divider />
                        <Grid container marginTop={1} spacing={3}>
                            <Grid item xs={6} md={4}>
                                <TextField
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    inputProps={{
                                        value: name,
                                        onChange: (e) => setName(e.target.value),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <TextField
                                    label="Email"
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    inputProps={{
                                        value: email,
                                        onChange: (e) => setEmail(e.target.value),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <TextField
                                    label="Number"
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    inputProps={{
                                        value: phone,
                                        onChange: (e) => setPhone(e.target.value),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    label="Address"
                                    rows={4}
                                    multiline
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    inputProps={{
                                        value: address,
                                        onChange: (e) => setAddress(e.target.value),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent >
            </Dialog >
        </>
    );
};
