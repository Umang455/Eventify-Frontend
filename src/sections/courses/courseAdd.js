import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import { DesktopDatePicker, DesktopDateTimePicker, MobileDatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import ReactQuill from 'react-quill'
import { toast } from "react-toastify";
import { addCourseAPI, addProjectCommunicationAPI, getAllProjectsAPI, getSystemUsers, registerUser } from "src/config/api";
import { _isValidEmail } from "src/utils/common";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// import { getDateRangePickerDayUtilityClass } from "@mui/lab";

export const CourseAdd = (props) => {
    const { open, setOpen, getData } = props;

    //fields for Communication Snippet
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [semester, setSemester] = useState('')
    useEffect(() => {

    }, []);

    const [moduleDetails, setModuleDetails] = useState([{ moduleNumber: "", moduleName: "", description: "" }]);

    const addmoduleDetails = () => {
        setModuleDetails([...moduleDetails, { moduleNumber: "", moduleName: "", description: "" }]);
    };

    const removemoduleDetails = (index) => {
        const updatedmoduleDetails = [...moduleDetails];
        updatedmoduleDetails.splice(index, 1);
        setModuleDetails(updatedmoduleDetails);
    };

    const handleTableDetailChange = (index, field, value) => {
        const updatemoduleDetails = [...moduleDetails];
        updatemoduleDetails[index][field] = value;
        setModuleDetails(updatemoduleDetails);
    };


    async function _onSave() {
        try {
            let data = {
                code,
                name,
                semester,
                modules: moduleDetails
                // phone,
                // email,
                // password: "111111",

            }
            let res = await axios.post(addCourseAPI, data)
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
                        Add Course
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
                        <Typography sx={{ fontSize: 20 }}>Course Details</Typography>
                        <Divider />
                        <Grid container marginTop={1} spacing={3}>
                            <Grid item xs={6} md={4}>
                                <TextField
                                    label="Code"
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    inputProps={{
                                        value: code,
                                        onChange: (e) => setCode(e.target.value),
                                    }}
                                />
                            </Grid>
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
                                    label="Semester"
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    inputProps={{
                                        value: semester,
                                        onChange: (e) => setSemester(e.target.value),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={12}>

                            </Grid>
                        </Grid>
                        <Box paddingY={2}>
                            <Typography sx={{ fontSize: 20 }}>Course Modules</Typography>
                            <Divider />

                            <Grid container spacing={2} sx={{ my: 5 }}>
                                {moduleDetails.map((details, index) => (
                                    <>
                                        <Grid container spacing={2} paddingY={1}>
                                            <Grid item md={3} xs={6}>
                                                <TextField
                                                    autoFocus
                                                    label="Module Number"
                                                    type="text"
                                                    fullWidth
                                                    variant="filled"
                                                    value={details.moduleNumber}
                                                    onChange={(e) => handleTableDetailChange(index, "moduleNumber", e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={6}>
                                                <TextField
                                                    autoFocus
                                                    label="Module Name"
                                                    type="text"
                                                    fullWidth
                                                    variant="filled"
                                                    value={details.moduleName}
                                                    onChange={(e) => handleTableDetailChange(index, "moduleName", e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item md={4} xs={6}>
                                                <TextField
                                                    autoFocus
                                                    multiline
                                                    rows={2}
                                                    label="Description"
                                                    type="text"
                                                    fullWidth
                                                    variant="filled"
                                                    value={details.description}
                                                    onChange={(e) => handleTableDetailChange(index, "description", e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item md={2} xs={12} >
                                                <IconButton onClick={addmoduleDetails} >
                                                    <AddCircleIcon fontSize='large' />
                                                </IconButton>
                                                {moduleDetails.length !== 1 ? (

                                                    <IconButton onClick={() => removemoduleDetails(index)} >
                                                        <RemoveCircleIcon fontSize='large' />
                                                    </IconButton>
                                                ) : null}
                                            </Grid>
                                        </Grid>
                                        <Divider />
                                    </>
                                ))}
                            </Grid>
                        </Box>
                    </Box>
                </DialogContent >
            </Dialog >
        </>
    );
};
