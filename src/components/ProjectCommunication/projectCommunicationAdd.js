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
import { addProjectCommunicationAPI, getAllProjectsAPI, getSystemUsers } from "src/config/api";
import { _isValidEmail } from "src/utils/common";
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export const ProjectCommunicationAdd = (props) => {
  const { open, setOpen, getCommunications } = props;

  //fields for Communication Snippet

  const [selectedProject, setSelectedProject] = useState(null);
  const [type, setType] = useState("");
  const [snippetContent, setSnippetContent] = useState("");
  const [from, setFrom] = useState("");
  const [communicationWith, setCommunicationWith] = useState(null);
  const [initDate, setInitDate] = useState(null);

  // saving all projecsts
  // console.log(initDate, "Check for time")

  const [projects, setProjects] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  const [clientUsers, setClientUsers] = useState([]);
  // const [closeModal , setCloseModal] = useState(false)

  useEffect(() => {
    _getProjects();
    _getUsers();
  }, []);

  async function _getProjects() {
    try {
      let res = await axios.get(getAllProjectsAPI);
      console.log(res.data);
      setProjects(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function _getUsers() {
    try {
      let res = await axios.get(getSystemUsers);
      setSystemUsers(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function _onSave() {
    try {
      let data = {
        project: selectedProject,
        type,
        from,
        with: communicationWith,
        description: snippetContent,
        initDate,
      };
      let res = await axios.post(addProjectCommunicationAPI, data);
      console.log(res.data);
      setOpen(false);
      toast.success("Added Communication");
      getCommunications();
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
          <Typography color="textPrimary" style={{ color: "#fff" }} gutterBottom variant="h6">
            Add New Project Communication
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
            <Typography sx={{ fontSize: 20 }}>Project Communication Details</Typography>
            <Divider />
            <Grid container marginTop={1} spacing={3}>
              <Grid item xs={6} md={4}>
                <Autocomplete
                  options={projects}
                  value={selectedProject}
                  onChange={(event, newValue) => {
                    setSelectedProject(newValue);
                  }}
                  getOptionLabel={(option) => option.name}
                  id="state"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select project"
                      variant="filled"
                      autoFocus
                      //  margin="dense"
                      id="projectName"
                      name="projectName"
                      //  error={!isValidclientName && projectName === ""}
                      //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                      type="text"
                      fullWidth
                      // inputProps={}
                      // error={!isValidState}
                      // helperText={!isValidState ? "Please Select State" : ""}
                      // error={!isValidTos}
                      // helperText={!isValidTos ? "Select Type of Service" : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6} md={4}>
              <TextField
                  autoFocus
                  //  margin="dense"
                  id="from"
                  name="from"
                  //  error={!isValidclientName && clientName === ""}
                  //  helperText={!isValidclientName && clientName === "" ? "Please enter name" : ""}
                  label="From"
                  type="text"
                  fullWidth
                  variant="filled"
                  inputProps={{
                    value: from,
                    onChange: (e) => setFrom(e.target.value),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={4}>
              <TextField
                  autoFocus
                  //  margin="dense"
                  id="with"
                  name="with"
                  //  error={!isValidclientName && clientName === ""}
                  //  helperText={!isValidclientName && clientName === "" ? "Please enter name" : ""}
                  label="With"
                  type="text"
                  fullWidth
                  variant="filled"
                  inputProps={{
                    value: communicationWith,
                    onChange: (e) => setCommunicationWith(e.target.value),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <Autocomplete
                  options={["Email", "GoogleMeet", "Call", "Whatsapp"]}
                  value={type}
                  onChange={(event, newValue) => {
                    setType(newValue);
                  }}
                  getOptionLabel={(option) => option}
                  id="state"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Type"
                      variant="filled"
                      autoFocus
                      //  margin="dense"
                      id="Type"
                      name="type"
                      //  error={!isValidclientName && projectName === ""}
                      //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                      type="text"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item md={6}>
                <DesktopDateTimePicker
                  value={initDate}
                  onChange={setInitDate}
                  inputFormat="dd/MM/yyyy"
                  label="Communication Date"
                  // inputVariant='filled'
                  renderInput={(params) => <TextField {...params} fullWidth variant="filled" />}
                />
              </Grid>
              <Grid item md={12}>
                <Typography fontSize={18} sx={{ borderBottomWidth: 1 }}>
                  Description
                </Typography>
                {/* <s
                                    value={snippetContent}
                                    onChange={setSnippetContent}
                                    theme="snow"
                                    modules={{
                                        toolbar: [
                                            [{ header: [1, 2, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ color: [] }, { background: [] }],
                                            [{ align: [] }],
                                            [{ list: 'ordered' }, { list: 'bullet' }],
                                            ['link', 'image'],
                                            ['clean'],
                                        ],
                                    }}
                                /> */}
              </Grid>
              <Grid item md={12}>
              <TextField
                      // {...params}
                      multiline
                      rows={4}
                      label="Description"
                      variant="filled"
                      autoFocus
                      //  margin="dense"
                      id="Type"
                      name="type"
                      //  error={!isValidclientName && projectName === ""}
                      //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                      type="text"
                      fullWidth
                    />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
