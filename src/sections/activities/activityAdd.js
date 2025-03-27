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
import { addActivitesAPI, addProjectCommunicationAPI, addStudentAPI, getAllProjectsAPI, getCourseAPI, getSystemUsers, registerUser } from "src/config/api";
import { _isValidoutcome } from "src/utils/common";
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FilePicker } from "src/components/helperFunctions/filepicker";
import { useUserStore } from "src/store/useStore";
// import { getDateRangePickerDayUtilityClass } from "@mui/lab";

export const ActivityAdd = (props) => {
    const { open, setOpen, getData } = props;

    const [userDetails, setUserDetails] = useUserStore(state => [state.userDetailsStore, state.updateUserDetails])


    //fields for Communication Snippet

    const [name, setName] = useState("")
    const [outcome, setOutcome] = useState("")
    const [date, setDate] = useState("")
    const [address, setAddress] = useState("")
    const [selectedCourses, setSelectedCourses] = useState([])
    const [courses, setCourses] = useState([])
    const [pdf, setPdf] = useState([])

    useEffect(() => {
        _getOptions()
    }, []);

    async function _getOptions() {
        try {
            let res = await axios.get(getCourseAPI);
            console.log(res.data);
            setCourses(res.data);
        } catch (e) {
            console.log(e);
        }
    }

    console.log("MY pdfEE", pdf)


    async function _onSave() {
        try {
            // let data = {
            //     name,
            //     date,
            //     outcome,
            //     address,
            //     coursesRegistered: selectedCourses,

            // }
            let formdata = new FormData()
            formdata.append("name", name)
            formdata.append("date", date)
            formdata.append("outcome", outcome)
            formdata.append("activityPdf", pdf[0].path)
            formdata.append("certificate", pdf[0].name)
            formdata.append("studentName", userDetails?.name)
            formdata.append("studentID", userDetails._id)
            let res = await axios.post(addActivitesAPI, formdata, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
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
                        Add Activity
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
                        <Typography sx={{ fontSize: 20 }}>Activity Details</Typography>
                        <Divider />
                        <Grid container marginTop={1} spacing={3}>
                            <Grid item md={12} >
                                <FilePicker
                                    files={pdf}
                                    maxFiles={1}
                                    buttonLabel={"Upload pdf"}
                                    id={"Cover pdf"}
                                    setNewFiles={setPdf}
                                    filetype={".pdf"}
                                />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <TextField
                                    label="Activity Name"
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
                                    label="Outcome"
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    inputProps={{
                                        value: outcome,
                                        onChange: (e) => setOutcome(e.target.value),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <TextField
                                    label="Date"
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    inputProps={{
                                        value: date,
                                        onChange: (e) => setDate(e.target.value),
                                    }}
                                />
                            </Grid>
                            {/* <Grid item xs={12} md={12}>
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
                            <Grid item md={12} >
                                <Autocomplete
                                    options={courses}
                                    multiple
                                    onChange={(e, newValue) => setSelectedCourses(newValue)}
                                    getOptionLabel={(s) => s.name}
                                    value={selectedCourses}
                                    renderInput={(params) => <TextField {...params} label="Courses" />}
                                />
                            </Grid> */}
                        </Grid>
                    </Box>
                </DialogContent >
            </Dialog >
        </>
    );
};
