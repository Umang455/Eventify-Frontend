import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Modal,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { _isValidEmail } from "src/utils/common";
import axios from "axios";
import { addSystemUser, editSystemUserAPI, registerUser } from "src/config/api";

export const SystemUserEdit = (props) => {
  const { open, setOpen, item } = props;
  //User Personal details
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [designations, setDesignations] = useState([]);
  const [userStatus, setUserStatus] = useState("");
  const [reportingPerson, setReportingPerson] = useState("");
  const [userNumber, setUserNumber] = useState(null);
  const [userRole, setUserRole] = useState("");

  // user roles fields

  const [canAdd, setCanAdd] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [viewDashboard, setViewDashboard] = useState(false);
  const [viewProjects, setViewProjects] = useState(false);
  const [viewProjectCommunications, setViewProjectCommunications] = useState(false);
  const [viewTickets, setViewTickets] = useState(false);
  const [viewReports, setViewReports] = useState(false);
  const [viewClientUsers, setViewClientUsers] = useState(false);
  const [viewSystemUsers, setViewSystemUsers] = useState(false);
  const [viewClients, setViewClients] = useState(false);
  const [viewCommunicationSnippets, setViewCommunicationSnippets] = useState(false);

  const [clientUsers, setClientUsers] = useState([]);
  // const [closeModal , setCloseModal] = useState(false)

  //states for editing client users
  const [isEditing, setIsEditing] = useState(false);
  const [editingSr, setEditingSr] = useState(null);

  useEffect(() => {
    console.log(item);
    setUserName(item?.name);
    setUserEmail(item?.email);
    setUserNumber(item?.phone);
    setDesignations(item?.designations);
    setUserStatus(item?.status);
    setUserRole(item?.role);
    setReportingPerson(item?.reportingPerson);
    setViewDashboard(item?.viewDashboard);
    setViewReports(item?.viewReports);
    setViewTickets(item?.viewTickets);
    setViewProjectCommunications(item?.viewProjectCommunications);
    setViewProjects(item?.viewProjects);
    setViewCommunicationSnippets(item?.viewCommunicationSnippets);
    setViewSystemUsers(item?.viewSystemUsers);
    setViewClientUsers(item?.viewClientUsers);
    setViewClients(item?.viewClients);
  }, [open]);

  //function for adding client user in table
  const addClientUser = () => {
    if (userName !== "" || userEmail !== "") {
      let newCLient = { name: userName, email: userEmail, number: userNumber };
      clientUsers.push(newCLient);
      console.log(clientUsers);
      setUserEmail("");
      setUserName("");
      setUserNumber("");
    }
  };

  async function _onSave() {
    try {
      let data = {
        name: userName,
        email: userEmail,
        phone: userNumber,
        designations: designations,
        role: userRole,
        reportingPerson: reportingPerson,
        isSystemUser: true,
        status: userStatus,
        viewDashboard,
        viewProjects,
        viewTickets,
        viewClientUsers,
        viewClients,
        viewProjectCommunications,
        viewCommunicationSnippets,
        viewReports,
        viewSystemUsers,
      };
      let res = await axios.patch(editSystemUserAPI(item?._id), data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  //function for deleting client user in table

  const deleteUser = (index) => {
    let array = clientUsers;
    array.splice(index, 1);
    setClientUsers(array);
    console.log("clicked");
  };

  useEffect(() => {
    console.log("first");
  }, [clientUsers]);

  console.log(viewTickets, "my Ticket");
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
            Edit System User
          </Typography>
          <Button sx={{ color: "#fff" }} onClick={() => _onSave()}>
            Save
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box padding={2}>
            <Typography sx={{ fontSize: 20 }}>User Details</Typography>
            <Divider />
            <Grid container marginTop={2} spacing={3}>
              <Grid item md={4} xs={6}>
                <TextField
                  autoFocus
                  //  margin="dense"
                  id="userName"
                  name="userName"
                  //  error={!isValidclientName && clientName === ""}
                  //  helperText={!isValidclientName && clientName === "" ? "Please enter name" : ""}
                  label="Name"
                  type="text"
                  fullWidth
                  variant="filled"
                  inputProps={{
                    value: userName,
                    onChange: (e) => setUserName(e.target.value),
                  }}
                />
              </Grid>
              <Grid item md={4} xs={6}>
                <TextField
                  autoFocus
                  //  margin="dense"
                  id="userEmail"
                  name="userEmail"
                  //  error={!isValidclientName && clientName === ""}
                  //  helperText={!isValidclientName && clientName === "" ? "Please enter name" : ""}
                  label="Email"
                  type="text"
                  fullWidth
                  variant="filled"
                  inputProps={{
                    value: userEmail,
                    onChange: (e) => setUserEmail(e.target.value),
                  }}
                />
              </Grid>
              <Grid item md={4} xs={6}>
                <TextField
                  autoFocus
                  //  margin="dense"
                  id="userNumber"
                  name="userNumber"
                  //  error={!isValidclientName && clientName === ""}
                  //  helperText={!isValidclientName && clientName === "" ? "Please enter name" : ""}
                  label="Number"
                  type="number"
                  fullWidth
                  variant="filled"
                  inputProps={{
                    value: userNumber,
                    onChange: (e) => setUserNumber(e.target.value),
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Autocomplete
                  multiple
                  options={[
                    "Frontend Developer",
                    "BackEnd Developer",
                    "UI/UX Designer",
                    "Tester",
                    "Web Developer",
                    "App Developer",
                    "Wordpressor",
                  ]}
                  value={designations}
                  onChange={(event, newValue) => {
                    setDesignations(newValue);
                  }}
                  getOptionLabel={(option) => option}
                  id="state"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Designation"
                      variant="filled"
                      autoFocus
                      //  margin="dense"
                      id="designations"
                      name="designations"
                      //  error={!isValidclientName && projectName === ""}
                      //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                      type="text"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <Autocomplete
                  options={["Active", "Inactive"]}
                  value={userStatus}
                  onChange={(event, newValue) => {
                    setUserStatus(newValue);
                  }}
                  getOptionLabel={(option) => option}
                  id="state"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Status"
                      variant="filled"
                      autoFocus
                      //  margin="dense"
                      id="status"
                      name="status"
                      //  error={!isValidclientName && projectName === ""}
                      //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                      type="text"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item md={2} xs={12}>
                <Autocomplete
                  options={["Super Admin", "Admin", "HOD", "Team Lead", "Dev", "Support"]}
                  value={userRole}
                  onChange={(event, newValue) => {
                    setUserRole(newValue);
                  }}
                  getOptionLabel={(option) => option}
                  id="reportingPerson"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Role"
                      variant="filled"
                      autoFocus
                      //  margin="dense"
                      id="role"
                      name="role"
                      //  error={!isValidclientName && projectName === ""}
                      //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                      type="text"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <Autocomplete
                  options={["Sarvesh", "Soumil"]}
                  value={reportingPerson}
                  onChange={(event, newValue) => {
                    setReportingPerson(newValue);
                  }}
                  getOptionLabel={(option) => option}
                  id="reportingPerson"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Reporting Person"
                      variant="filled"
                      autoFocus
                      //  margin="dense"
                      id="reportingPerson"
                      name="reportingPerson"
                      //  error={!isValidclientName && projectName === ""}
                      //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                      type="text"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
            <Typography sx={{ fontSize: 20 }}>Roles</Typography>
            <Divider />
            <FormGroup>
              <Grid container>
                <Grid item md={4} display={"flex"} flexDirection={"column"}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={viewDashboard}
                        value={viewDashboard}
                        onChange={(e) => setViewDashboard(e.target.checked)}
                      />
                    }
                    label="View DashBoard"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={viewProjects}
                        value={viewProjects}
                        onChange={(e) => setViewProjects(e.target.checked)}
                      />
                    }
                    label="View Projects"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={viewProjectCommunications}
                        value={viewProjectCommunications}
                        onChange={(e) => setViewProjectCommunications(e.target.checked)}
                      />
                    }
                    label="View Project Communications"
                  />
                </Grid>
                <Grid item md={4} display={"flex"} flexDirection={"column"}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={viewTickets}
                        value={viewTickets}
                        onChange={(e) => setViewTickets(e.target.checked)}
                      />
                    }
                    label="View tickets"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={viewReports}
                        value={viewReports}
                        onChange={(e) => setViewTickets(e.target.checked)}
                      />
                    }
                    label="View Reports"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={viewClientUsers}
                        value={viewClientUsers}
                        onChange={(e) => setViewClientUsers(e.target.checked)}
                      />
                    }
                    label="View Client Users"
                  />
                </Grid>
                <Grid item md={4} display={"flex"} flexDirection={"column"}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={viewSystemUsers}
                        value={viewSystemUsers}
                        onChange={(e) => setViewSystemUsers(e.target.checked)}
                      />
                    }
                    label="View System Users"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={viewClients}
                        value={viewClients}
                        onChange={(e) => setViewClients(e.target.checked)}
                      />
                    }
                    label="View Clients"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={viewCommunicationSnippets}
                        value={viewCommunicationSnippets}
                        onChange={(e) => setViewCommunicationSnippets(e.target.checked)}
                      />
                    }
                    label="View Communication Snippets"
                  />
                </Grid>
              </Grid>
            </FormGroup>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
