import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Modal,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { _isValidEmail } from "src/utils/common";
// import ReactQuill from 'react-quill';
import Autocomplete from "@mui/material/Autocomplete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// import 'react-quill/dist/quill.snow.css';
import { Scrollbar } from "../scrollbar";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { addProject, getSystemUsers } from "src/config/api";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { getCompaniesAPI } from "src/config/api";

export const ProjectAdd = (props) => {
  const { open, setOpen, getProjects } = props;
  const [projectDetails, setProjectDetails] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [clientNumber, setClientNumber] = useState();
  const [projectTeam, setProjectTeam] = useState([]);
  const [projectAdmin, setProjectAdmin] = useState([]);
  const [projectSupport, setProjectSupport] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [projectStatus, setProjectStatus] = useState("");
  const [client, setClient] = useState(null);

  // modules list fields

  const [moduleList, setModuleList] = useState([]);
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleOrder, setModuleOrder] = useState(null);

  //milestones Fields

  const [mileStonesList, setMileStonesList] = useState([]);
  const [mileStoneName, setMileStoneName] = useState("");
  const [mileStoneStart, setMileStoneStart] = useState(null);
  const [mileStoneEnd, setMileStoneEnd] = useState(null);
  const [mileStoneModules, setMileStoneModules] = useState([]);

  // const handleDateChange = (date) => {
  //     setStartDate(date);
  // };

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    _getUsers();
    _getCients();
  }, []);

  async function _getCients() {
    try {
      let res = await axios.get(getCompaniesAPI);
      setCompanies(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function _getUsers() {
    try {
      let res = await axios.get(getSystemUsers + `?isSystemUser=${true}`);
      setUsers(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  const handleModuleAdd = () => {
    if (moduleName === "" || moduleDescription === "" || moduleOrder === "") {
      return;
    } else {
      let newModule = {
        moduleName: moduleName,
        moduleDescription: moduleDescription,
        execOrder: moduleOrder,
      };
      moduleList.push(newModule);
      setModuleName("");
      setModuleDescription("");
      setModuleOrder("");
    }
  };

  const handleMileStoneAdd = () => {
    if (mileStoneName === "" || mileStoneModules?.length === 0) {
      return;
    } else {
      let newMileStone = {
        name: mileStoneName,
        modules: mileStoneModules,
        startDate: mileStoneStart,
        endDate: mileStoneEnd,
      };
      mileStonesList.push(newMileStone);
      setMileStoneName("");
      setMileStoneModules([]);
      setMileStoneStart(null);
      setMileStoneEnd(null);
    }
  }; // const [closeModal , setCloseModal] = useState(false)

  const refresh = () => {
    setProjectAdmin([]);
    setProjectTeam([]);
    setProjectName("");
    setProjectType("");
    setProjectDetails("");
    setProjectSupport([]);
    setProjectStatus("");
    setMileStonesList([]);
    setModuleList([]);
  };

  async function _onSave() {
    try {
      let data = {
        name: projectName,
        type: projectType,
        description: projectDetails,
        projectAdmin: projectAdmin,
        projectSupport,
        projectTeam,
        status: projectStatus,
        modules: moduleList,
        mileStones: mileStonesList,
        client,
      };

      let res = await axios.post(addProject, data);
      console.log(res);
      setOpen(false);
      getProjects();
      refresh();
      toast.success("Added");
    } catch (e) {
      console.log(e);
    }
  }

  console.log(projectAdmin);
  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
              Add New Project
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
              <Typography sx={{ fontSize: 20 }}>Project Details</Typography>
              <Divider />
              <Grid container marginTop={2} spacing={3}>
                <Grid item md={3} xs={6}>
                  <TextField
                    autoFocus
                    //  margin="dense"
                    id="projectName"
                    name="projectName"
                    //  error={!isValidclientName && projectName === ""}
                    //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                    label="Project Name"
                    type="text"
                    fullWidth
                    variant="filled"
                    inputProps={{
                      value: projectName,
                      onChange: (e) => setProjectName(e.target.value),
                    }}
                  />
                </Grid>
                <Grid item md={3} xs={6}>
                  <Autocomplete
                    options={["Web", "App"]}
                    value={projectType}
                    onChange={(event, newValue) => {
                      setProjectType(newValue);
                    }}
                    getOptionLabel={(option) => option}
                    id="state"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select project Type"
                        variant="filled"
                        autoFocus
                        //  margin="dense"
                        id="projectName"
                        name="projectName"
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
                <Grid item md={3} xs={6}>
                  <Autocomplete
                    options={companies}
                    value={client}
                    onChange={(event, newValue) => {
                      setClient(newValue);
                    }}
                    getOptionLabel={(option) => option.name}
                    id="state"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Client"
                        variant="filled"
                        autoFocus
                        //  margin="dense"
                        id="projectName"
                        name="projectName"
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
                <Grid item xs={6} md={3}>
                  <Autocomplete
                    options={[
                      "In Requirement Gathering",
                      "In Ui Ux Designing",
                      "In Development",
                      "In Testing",
                      "In beta Launch",
                      "In Production",
                    ]}
                    value={projectStatus}
                    onChange={(event, newValue) => {
                      setProjectStatus(newValue);
                    }}
                    getOptionLabel={(option) => option}
                    id="state"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project Status"
                        variant="filled"
                        autoFocus
                        //  margin="dense"
                        id="projectName"
                        name="projectName"
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
                  <Typography fontSize={18} sx={{ borderBottomWidth: 1 }}>
                    Project Description
                  </Typography>
                  {/* <ReactQuill
                                        value={projectDetails}
                                        onChange={setProjectDetails}
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
              </Grid>
              <Grid container>
                {/* <Grid item md={4} xs={12}>

                                    <DatePicker
                                        value={startDate}
                                        onChange={setStartDate}
                                        inputFormat="DD/MM/YYYY"
                                        label="Select Date"
                                        inputVariant="outlined"
                                    />
                                </Grid> */}
              </Grid>
              <Typography sx={{ fontSize: 20, marginTop: 5 }}>Project Roles</Typography>
              <Divider />
              <Grid container marginTop={1} spacing={3}>
                <Grid item xs={6} md={4}>
                  <Autocomplete
                    multiple
                    options={users}
                    value={projectAdmin}
                    onChange={(event, newValue) => {
                      setProjectAdmin(newValue);
                    }}
                    getOptionLabel={(option) => option.name}
                    id="state"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project Admin"
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
                <Grid item xs={6} md={4}>
                  <Autocomplete
                    multiple
                    options={users}
                    value={projectSupport}
                    onChange={(event, newValue) => {
                      setProjectSupport(newValue);
                    }}
                    getOptionLabel={(option) => option.name}
                    id="state"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project Support"
                        variant="filled"
                        autoFocus
                        //  margin="dense"
                        id="projectName"
                        name="projectName"
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
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    multiple
                    options={users}
                    value={projectTeam}
                    onChange={(event, newValue) => {
                      setProjectTeam(newValue);
                    }}
                    getOptionLabel={(option) => option.name}
                    id="state"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project Team"
                        variant="filled"
                        autoFocus
                        //  margin="dense"
                        id="projectName"
                        name="projectName"
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
              </Grid>
              <Typography sx={{ fontSize: 20, marginTop: 5 }}>Modules</Typography>
              <Divider />
              <Grid container marginTop={1} spacing={3}>
                <Grid item xs={6} md={4}>
                  <TextField
                    autoFocus
                    //  margin="dense"
                    id="moduleName"
                    name="moduleName"
                    //  error={!isValidclientName && projectName === ""}
                    //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                    label="Module Name"
                    type="text"
                    fullWidth
                    variant="filled"
                    inputProps={{
                      value: moduleName,
                      onChange: (e) => setModuleName(e.target.value),
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={4}>
                  <TextField
                    autoFocus
                    //  margin="dense"
                    id="moduleOrder"
                    name="moduleOrder"
                    //  error={!isValidclientName && projectName === ""}
                    //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                    label="Execution Order"
                    type="number"
                    fullWidth
                    variant="filled"
                    inputProps={{
                      value: moduleOrder,
                      onChange: (e) => setModuleOrder(e.target.value),
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={8}>
                  <TextField
                    autoFocus
                    //  margin="dense"
                    id="moduleDescription"
                    name="moduleDescription"
                    //  error={!isValidclientName && projectName === ""}
                    //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                    label="Module description"
                    type="text"
                    fullWidth
                    variant="filled"
                    inputProps={{
                      value: moduleDescription,
                      onChange: (e) => setModuleDescription(e.target.value),
                    }}
                  />
                </Grid>
                <Grid item xs={3} md={2}>
                  <IconButton onClick={handleModuleAdd}>
                    <AddCircleIcon fontSize="large" />
                  </IconButton>
                </Grid>
              </Grid>
              <Box paddingX={5} paddingY={2}>
                {moduleList?.length > 0 ? (
                  <>
                    <Typography variant="h4" paddingBottom={3}>
                      Modules List
                    </Typography>
                    <Card>
                      <Scrollbar>
                        <Box>
                          <Table>
                            <TableHead>
                              <TableCell>Execution Order</TableCell>
                              <TableCell>Module Name</TableCell>
                              <TableCell>Module Description</TableCell>
                            </TableHead>
                            {moduleList.map((module, index) => (
                              <>
                                <TableRow>
                                  <TableCell>{module.execOrder}</TableCell>
                                  <TableCell>{module.moduleName}</TableCell>
                                  <TableCell>{module.moduleDescription}</TableCell>
                                </TableRow>
                              </>
                            ))}
                          </Table>
                        </Box>
                      </Scrollbar>
                    </Card>
                  </>
                ) : null}
              </Box>
              <Typography sx={{ fontSize: 20, marginTop: 5 }}>MileStones</Typography>
              <Divider />
              <Grid container marginTop={1} spacing={3}>
                <Grid item xs={6} md={3}>
                  <TextField
                    autoFocus
                    //  margin="dense"
                    id="mileStoneName"
                    name="mileStoneName"
                    //  error={!isValidclientName && projectName === ""}
                    //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                    label="MileStone Name"
                    type="text"
                    fullWidth
                    variant="filled"
                    inputProps={{
                      value: mileStoneName,
                      onChange: (e) => setMileStoneName(e.target.value),
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={3}>
                  <Autocomplete
                    multiple
                    options={moduleList}
                    value={mileStoneModules}
                    onChange={(event, newValue) => {
                      setMileStoneModules(newValue);
                    }}
                    getOptionLabel={(option) => option?.moduleName}
                    id="state"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Modules"
                        variant="filled"
                        autoFocus
                        //  margin="dense"
                        id="projectName"
                        name="projectName"
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
                <Grid item md={2}>
                  <DesktopDatePicker
                    value={mileStoneStart}
                    onChange={setMileStoneStart}
                    inputFormat="dd/MM/yyyy"
                    label="Start Date"
                    // inputVariant='filled'
                    renderInput={(params) => <TextField {...params} fullWidth variant="filled" />}
                  />
                </Grid>
                <Grid item md={2}>
                  <DesktopDatePicker
                    value={mileStoneEnd}
                    onChange={setMileStoneEnd}
                    inputFormat="dd/MM/yyyy"
                    label="End Date"
                    // inputVariant='filled'
                    renderInput={(params) => <TextField {...params} fullWidth variant="filled" />}
                  />
                </Grid>
                <Grid item xs={3} md={1}>
                  <IconButton onClick={handleMileStoneAdd}>
                    <AddCircleIcon fontSize="large" />
                  </IconButton>
                </Grid>
              </Grid>
              <Box paddingX={5} paddingY={2}>
                {mileStonesList?.length > 0 ? (
                  <>
                    <Typography variant="h4" paddingBottom={2}>
                      MileStone List
                    </Typography>
                    <Card>
                      <Scrollbar>
                        <Box>
                          <Table>
                            <TableHead>
                              <TableCell>Name</TableCell>
                              <TableCell>Modules</TableCell>
                              <TableCell>Start Date</TableCell>
                              <TableCell>End Date</TableCell>
                            </TableHead>
                            <TableRow>
                              {mileStonesList.map((mileStone, index) => (
                                <>
                                  <TableCell>{mileStone.name}</TableCell>
                                  <TableCell>
                                    {mileStone.modules?.map((module) => {
                                      <>
                                        <Box display={"flex"} flexDirection={"row"}>
                                          {module.moduleName}
                                        </Box>
                                      </>;
                                    })}
                                  </TableCell>
                                  <TableCell>{moment(mileStone?.startDate).format("LL")}</TableCell>
                                  <TableCell>{moment(mileStone?.endDate).format("LL")}</TableCell>
                                </>
                              ))}
                            </TableRow>
                          </Table>
                        </Box>
                      </Scrollbar>
                    </Card>
                  </>
                ) : null}
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </MuiPickersUtilsProvider>
    </>
  );
};
