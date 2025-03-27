import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, Modal, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { _isValidEmail } from 'src/utils/common'

export const ClientUserAdd = (props) => {

  const { open, setOpen } = props
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientNumber, setClientNumber] = useState()
  const [clientAddress, setClientAddress] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [companyEmail, setCompanyEmail] = useState("")

  // const [closeModal , setCloseModal] = useState(false)

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} fullScreen >
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            background: "#6366F1",
            color: "#fff",
            alignItems: "center",
            height: 60,
            padding: "20px",
            paddingLeft: '50px',
            paddingRight: '50px'
          }}
        >
          <Typography color="textPrimary" style={{ color: "#fff" }} gutterBottom variant="h6">
            Add Client User
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
          <Box padding={2} >
            <Typography sx={{ fontSize: 20 }}>
              Client User Details
            </Typography>
            <Divider />
            <Grid container marginTop={2} spacing={3}>
              <Grid item md={4} xs={6}>
                <TextField
                  autoFocus
                  //  margin="dense"
                  id="clientName"
                  name="clientName"
                  //  error={!isValidclientName && clientName === ""}
                  //  helperText={!isValidclientName && clientName === "" ? "Please enter name" : ""}
                  label="Customer Name"
                  type="text"
                  fullWidth
                  variant="filled"
                  inputProps={{
                    value: clientName,
                    onChange: (e) => setClientName(e.target.value),
                  }}
                />
              </Grid>
              <Grid item md={4} xs={6}>
                <TextField
                  autoFocus
                  //  margin="dense"
                  id="clientEmail"
                  name="clientEmail"
                  //  error={!isValidclientName && clientName === ""}
                  //  helperText={!isValidclientName && clientName === "" ? "Please enter name" : ""}
                  label="Customer Email"
                  type="text"
                  fullWidth
                  variant="filled"
                  inputProps={{
                    value: clientEmail,
                    onChange: (e) => setClientEmail(e.target.value),
                  }}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  autoFocus
                  //  margin="dense"
                  id="clientNumber"
                  name="clientNumber"
                  //  error={!isValidclientName && clientName === ""}
                  //  helperText={!isValidclientName && clientName === "" ? "Please enter name" : ""}
                  label="Customer Phone"
                  type="Number"
                  fullWidth
                  variant="filled"
                  inputProps={{
                    value: clientNumber,
                    onChange: (e) => setClientNumber(e.target.value),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
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
                />
              </Grid>
            </Grid>
            <Typography sx={{ fontSize: 20 , marginTop:5}}>
              Company Details
            </Typography>
            <Divider />
            <Grid container marginTop={1} spacing={3}>
            <Grid item>
              <TextField
                autoFocus
                //  margin="normal"
                id="companyName"
                name="companyName"
                //  error={!isValidclientName && clientName === ""}
                //  helperText={!isValidclientName && clientName === "" ? "Please enter name" : ""}
                label="Company Name"
                type="text"
                
                variant="filled"
                inputProps={{
                  value: companyName,
                  onChange: (e) => setCompanyName(e.target.value),
                }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              {" "}
              <TextField
                autoFocus
                //  margin="dense"
                id="companyEmail"
                name="companyEmail"
                //  error={!isValidclientName && clientName === ""}a
                //  helperText={!isValidclientName && clientName === "" ? "Please enter name" : ""}
                label="Company Email"
                type="email"
                fullWidth
                variant="filled"
                inputProps={{
                  value: companyEmail,
                  onChange: (e) => setCompanyEmail(e.target.value),
                }}
              />
            </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
