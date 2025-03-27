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
import axios from "axios";
import React, { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
import { addCompanySnippet, editCompanySnippet } from "src/config/api";
import { _isValidEmail } from "src/utils/common";

export const CommunicationSnippetEdit = (props) => {
  if (typeof document !== "undefined") {
    console.log("heeeeeeredoc");
    // you are safe to use the "document" object here
    console.log("doc", document.location.href);
  }

  if (typeof window !== "undefined") {
    console.log("heeeeeerewin");
    // you are safe to use the "document" object here
    console.log("win", window.location.href);
  }
  // useEffect(() => {
  //   console.log("heeeeeere201");
  //   // you are safe to use the 'document' object here
  //   document.title = "DUSS Academy";
  // }, []);

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
      let data = {
        snippetTitle: title,
        snippetType: type,
        snippetContent,
      };
      let res = await axios.patch(editCompanySnippet(item._id), data);
      console.log(res);
      setOpen(false);
      toast.success("Edited Successfully");
      getSnippets();
      setTitle("");
      setType("");
      setSnippetContent("");
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
            Edit Communication Snippet
          </Typography>
          <Button sx={{ color: "#fff" }} onClick={() => _onSave()}>
            Save
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
                <Autocomplete
                  options={["Email"]}
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
              <Grid item md={12}>
                <Typography fontSize={18} sx={{ borderBottomWidth: 1 }}>
                  Description
                </Typography>
                {/* <ReactQuill
                  value={snippetContent}
                  onChange={setSnippetContent}
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ color: [] }, { background: [] }],
                      [{ align: [] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                /> */}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
