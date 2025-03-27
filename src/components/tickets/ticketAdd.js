import {
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
import React, { useEffect, useState } from "react";
import { _isValidEmail } from "src/utils/common";
// import ReactQuill from 'react-quill';
import Autocomplete from "@mui/material/Autocomplete";

// import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import { addTicketsAPI, getAllProjectsAPI, getSystemUsers } from "src/config/api";
import { toast } from "react-toastify";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { DesktopDatePicker } from "@mui/x-date-pickers";

export const TicketsAdd = (props) => {
  const { open, setOpen, getTickets } = props;

  //ticket fields
  const [ticketDescription, setTicketDescription] = useState("");
  const [title, setTitle] = useState("");
  const [assignTo, setAssignTo] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [severity, setSeverity] = useState("");
  const [selectedMileStone, setSelectedMileStone] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  //array of users and projects
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  // const [closeModal , setCloseModal] = useState(false)

  useEffect(() => {
    _getProjects();
    _getSystemUsers();
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

  async function _getSystemUsers() {
    try {
      let res = await axios.get(getSystemUsers + `?isSystemUser=${true}`);
      setUsers(res.data);
    } catch (e) {}
  }

  console.log(startDate);

  async function _onSave() {
    try {
      let data = {
        title: title,
        assignToId: assignTo._id,
        assignToName: assignTo.name,
        description: ticketDescription,
        severity: severity,
        type: ticketType,
        releaseMilestone: selectedMileStone,
        project: selectedProject,
        startDate,
        endDate,
      };
      let res = await axios.post(addTicketsAPI, data);
      console.log(res.data);
      toast.success("Ticket Assigned");
      getTickets();
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
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
            Add Tickets
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
            <Typography sx={{ fontSize: 20 }}>Ticket Details</Typography>
            <Divider />
            <Grid container marginTop={2} spacing={3}>
              <Grid item md={8} xs={6}>
                <TextField
                  autoFocus
                  id="title"
                  name="title"
                  label="Title"
                  type="text"
                  fullWidth
                  variant="filled"
                  inputProps={{
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                  }}
                />
              </Grid>
              <Grid item md={4} xs={6}>
                <Autocomplete
                  options={users}
                  value={assignTo}
                  onChange={(event, newValue) => {
                    setAssignTo(newValue);
                  }}
                  getOptionLabel={(option) => option.name}
                  id="state"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assign To"
                      variant="filled"
                      autoFocus
                      //  margin="dense"
                      id="assignTo"
                      name="assingTo"
                      //  error={!isValidclientName && projectName === ""}
                      //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                      type="text"
                      fullWidth
                      // error={!isValidState}
                      // helperText={!isValidState ? "Please Select State" : ""}
                      // error={!isValidTos}
                      // helperText={!isValidTos ? "Select Type of Service" : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <TextField
                  autoFocus
                  //  margin="dense"
                  id="clientAddress"
                  name="clientAddress"
                  //  error={!isValidclientName && clientName === ""}
                  //  helperText={!isValidclientName && clientName === "" ? "Please enter name" : ""}
                  label="Customer Address"
                  type="text"
                  fullWidth
                  variant="filled"
                  inputProps={{
                    value: clientAddress,
                    onChange: (e) => setClientAddress(e.target.value),
                }}
                /> */}
                <Typography fontSize={18} sx={{ borderBottomWidth: 1 }}>
                  Ticket Description
                </Typography>
                {/* <ReactQuill
                                    value={ticketDescription}
                                    onChange={setTicketDescription}
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
              <Grid item md={4} xs={12}>
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
                      label="Project"
                      variant="filled"
                      autoFocus
                      //  margin="dense"
                      id="projectName"
                      name="projectName"
                      //  error={!isValidclientName && projectName === ""}
                      //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                      type="text"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item md={4} xs={6}>
                <Autocomplete
                  options={["Show Stopper", "Critical", "Major", "Minor"]}
                  value={severity}
                  onChange={(event, newValue) => {
                    setSeverity(newValue);
                  }}
                  getOptionLabel={(option) => option}
                  id="state"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Severity"
                      variant="filled"
                      autoFocus
                      //  margin="dense"
                      id="severity"
                      name="severity"
                      //  error={!isValidclientName && projectName === ""}
                      //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                      type="text"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item md={4} xs={6}>
                <Autocomplete
                  options={["1.0.0", "1.0.1", "1.0.2", "1.0.3", "1.0.4"]}
                  value={selectedMileStone}
                  onChange={(event, newValue) => {
                    setSelectedMileStone(newValue);
                  }}
                  getOptionLabel={(option) => option}
                  id="state"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Release MileStones"
                      variant="filled"
                      autoFocus
                      //  margin="dense"
                      id="severity"
                      name="severity"
                      //  error={!isValidclientName && projectName === ""}
                      //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                      type="text"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item md={4} xs={6}>
                <Autocomplete
                  options={["Internal", "External"]}
                  value={ticketType}
                  onChange={(event, newValue) => {
                    setTicketType(newValue);
                  }}
                  getOptionLabel={(option) => option}
                  id="state"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ticket Type"
                      variant="filled"
                      autoFocus
                      //  margin="dense"
                      id="Type"
                      name="Type"
                      //  error={!isValidclientName && projectName === ""}
                      //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                      type="text"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item md={2}>
                <DesktopDatePicker
                  value={startDate}
                  onChange={setStartDate}
                  inputFormat="dd/MM/yyyy"
                  label="Start Date"
                  // inputVariant='filled'
                  renderInput={(params) => <TextField {...params} fullWidth variant="filled" />}
                />
              </Grid>
              <Grid item md={2}>
                <DesktopDatePicker
                  value={endDate}
                  onChange={setEndDate}
                  inputFormat="dd/MM/yyyy"
                  label="End Date"
                  // inputVariant='filled'
                  renderInput={(params) => <TextField {...params} fullWidth variant="filled" />}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
