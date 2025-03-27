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
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import ReactQuill from 'react-quill'
import { addCompanySnippet, editCompanySnippet } from "src/config/api";
import { _isValidEmail } from "src/utils/common";

export const CommunicationSnippetView = (props) => {
  const { open, setOpen, getSnippets, item } = props;
  console.log(item, "my oitem");

  //fields for Communication Snippet
  const [snippet, setSnippet] = useState(item);
  const [title, setTitle] = useState(item?.snippetTitle);
  const [type, setType] = useState(item?.snippetType);
  const [snippetContent, setSnippetContent] = useState(item?.snippetContent);

  console.log(title, "my title");
  useEffect(() => {
    console.log(item, "use item");
    setTitle(item?.snippetTitle);
    setType(item?.snippetType);
    setSnippetContent(item?.snippetContent);
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
            View Snippet
          </Typography>
          <Button sx={{ color: "#fff" }} onClick={() => _onSave()}>
            Close
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box padding={2}>
            <Typography sx={{ fontSize: 20 }}>Snippet Details</Typography>
            <Divider />
            <Grid container marginTop={1} spacing={3}>
              <Grid item xs={6} md={6}>
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
              <Grid item xs={6} md={6}>
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
                    value: type,
                    onChange: (e) => setTitle(e.target.value),
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
                    dangerouslySetInnerHTML={{ __html: snippetContent }}
                  ></Typography>
                </Box>
              </Card>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
