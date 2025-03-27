import {
  Autocomplete,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Modal,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
import { addCompanySnippet, editCompanySnippet } from "src/config/api";
import { _isValidEmail } from "src/utils/common";
import { Scrollbar } from "../scrollbar";

export const ProjectView = (props) => {
  const { open, setOpen, getSnippets, item } = props;
  console.log(item, "my oitem");

  //fields for Communication Snippet
  const [snippet, setSnippet] = useState(item);
  const [title, setTitle] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [clientNumber, setClientNumber] = useState();
  const [projectTeam, setProjectTeam] = useState([]);
  const [projectAdmin, setProjectAdmin] = useState([]);
  const [projectSupport, setProjectSupport] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [projectStatus, setProjectStatus] = useState("");
  const [type, setType] = useState(item?.snippetType);
  const [modulesList, setModulesList] = useState([]);
  const [snippetContent, setSnippetContent] = useState(item?.snippetContent);

  console.log(title, "my title");
  useEffect(() => {
    console.log(item, "use item");
    setTitle(item?.name);
    setProjectType(item?.type);
    setProjectStatus(item?.status);
    setProjectDescription(item?.description);
    setProjectAdmin(item?.projectAdmin);
    setProjectSupport(item?.projectSupport);
    setProjectTeam(item?.projectTeam);
    setModulesList(item?.modules);

    console.log("s");
  }, [open]);

  async function _onSave() {
    try {
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  }

  // const [closeModal , setCloseModal] = useState(false)

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
            Project View
          </Typography>
          <Button sx={{ color: "#fff" }} onClick={() => _onSave()}>
            Close
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box padding={2}>
            <Typography sx={{ fontSize: 20 }}>Project Details</Typography>
            <Divider />
            <Grid container marginTop={1} spacing={3}>
              <Grid item xs={6} md={4}>
                {" "}
                <TextField
                  autoFocus
                  disabled
                  //  margin="dense"
                  id="title"
                  name="title"
                  //  error={!isValidclientName && clientName === ""}a
                  //  helperText={!isValidclientName && clientName === "" ? "Please enter name" : ""}
                  label="Title"
                  type="email"
                  fullWidth
                  variant="filled"
                  inputProps={{
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  label="Type"
                  variant="filled"
                  autoFocus
                  disabled
                  //  margin="dense"
                  id="Type"
                  name="type"
                  //  error={!isValidclientName && projectName === ""}
                  //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                  type="text"
                  fullWidth
                  inputProps={{
                    value: projectType,
                    onChange: (e) => setTitle(e.target.value),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  label="Status"
                  variant="filled"
                  autoFocus
                  disabled
                  //  margin="dense"
                  id="Type"
                  name="type"
                  //  error={!isValidclientName && projectName === ""}
                  //  helperText={!isValidclientName && projectName === "" ? "Please enter name" : ""}
                  type="text"
                  fullWidth
                  inputProps={{
                    value: projectStatus,
                    // onChange: (e) => setTitle(e.target.value),
                  }}
                />
              </Grid>
            </Grid>
            <Box marginY={5}>
              <Typography fontSize={24} sx={{ borderBottomWidth: 1 }}>
                Description
              </Typography>
              <Divider />
              <Card padding={10}>
                <Box padding={2}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    dangerouslySetInnerHTML={{ __html: projectDescription }}
                  ></Typography>
                </Box>
              </Card>
            </Box>
            <Grid container>
              <Grid item md={4}>
                <Typography variant="h5">Project Admin</Typography>
                {projectAdmin?.map((key, i) => (
                  <Box key={i._id}>{i.name}</Box>
                ))}
              </Grid>
              <Grid item md={4}>
                <Typography variant="h5">Project Support</Typography>
                {projectSupport?.map((key, i) => (
                  <Box key={i._id}>{i.name}</Box>
                ))}
              </Grid>
              <Grid item md={4}>
                <Typography variant="h5">Project Admin</Typography>
                {projectTeam?.map((i) => (
                  <Box key={i._id}>{i.name}</Box>
                ))}
              </Grid>
            </Grid>

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
                    {modulesList?.map((module, index) => (
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
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
