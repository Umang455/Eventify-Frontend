import { useState } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    TextField,
    Grid,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Chip,
    Avatar,
    IconButton,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from 'src/config/api';

const steps = ['Personal Information', 'Professional Details', 'Family Details', 'Interests & Preferences', 'Profile Setup'];

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    margin: theme.spacing(2),
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const OnboardingForm = ({ onComplete }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [formData, setFormData] = useState({
        // Step 1: Personal Information
        name: '',
        email: '',
        phone: '',
        dateOfBirth: null,
        gender: '',
        address: '',

        // Step 2: Professional Details
        occupation: '',
        company: '',
        experience: '',
        skills: [],

        // Step 3: Family Details
        maritalStatus: '',
        spouseName: '',
        numberOfChildren: 0,
        childrenDetails: [],

        // Step 4: Interests & Preferences
        interests: [],
        preferredEventTypes: [],
        notificationSettings: {
            email: true,
            push: true
        },

        // Step 5: Profile Setup
        profilePicture: null,
        bio: '',
        socialLinks: {
            linkedin: '',
            twitter: '',
            instagram: ''
        }
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formDataToSend = new FormData();

            // Append all form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'profilePicture' && value) {
                    formDataToSend.append('profilePicture', value);
                } else if (typeof value === 'object' && value !== null) {
                    formDataToSend.append(key, JSON.stringify(value));
                } else {
                    formDataToSend.append(key, value);
                }
            });

            const response = await axios.post(`${baseUrl}users/onboarding`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setSnackbar({
                    open: true,
                    message: 'Account created successfully!',
                    severity: 'success'
                });
                // Call the onComplete callback with user data
                onComplete(response.data.user);
            }
        } catch (error) {
            console.error('Error during onboarding:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.msg || 'Failed to create account',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    value={formData.gender}
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                    label="Gender"
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                    <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                );

            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Occupation"
                                value={formData.occupation}
                                onChange={(e) => handleChange('occupation', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Company"
                                value={formData.company}
                                onChange={(e) => handleChange('company', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Years of Experience"
                                type="number"
                                value={formData.experience}
                                onChange={(e) => handleChange('experience', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Skills (comma separated)"
                                value={formData.skills.join(', ')}
                                onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()))}
                            />
                            <Box sx={{ mt: 1 }}>
                                {formData.skills.map((skill, index) => (
                                    <Chip
                                        key={index}
                                        label={skill}
                                        onDelete={() => {
                                            const newSkills = [...formData.skills];
                                            newSkills.splice(index, 1);
                                            handleChange('skills', newSkills);
                                        }}
                                        sx={{ m: 0.5 }}
                                    />
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                );

            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Marital Status</InputLabel>
                                <Select
                                    value={formData.maritalStatus}
                                    onChange={(e) => handleChange('maritalStatus', e.target.value)}
                                    label="Marital Status"
                                >
                                    <MenuItem value="Single">Single</MenuItem>
                                    <MenuItem value="Married">Married</MenuItem>
                                    <MenuItem value="Divorced">Divorced</MenuItem>
                                    <MenuItem value="Widowed">Widowed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Spouse Name"
                                value={formData.spouseName}
                                onChange={(e) => handleChange('spouseName', e.target.value)}
                                disabled={formData.maritalStatus !== 'Married'}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Number of Children"
                                type="number"
                                value={formData.numberOfChildren}
                                onChange={(e) => handleChange('numberOfChildren', e.target.value)}
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                        {formData.numberOfChildren > 0 && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Children Details
                                </Typography>
                                {Array.from({ length: formData.numberOfChildren }).map((_, index) => (
                                    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label={`Child ${index + 1} Name`}
                                                value={formData.childrenDetails[index]?.name || ''}
                                                onChange={(e) => {
                                                    const newChildrenDetails = [...(formData.childrenDetails || [])];
                                                    newChildrenDetails[index] = {
                                                        ...newChildrenDetails[index],
                                                        name: e.target.value
                                                    };
                                                    handleChange('childrenDetails', newChildrenDetails);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label={`Child ${index + 1} Age`}
                                                type="number"
                                                value={formData.childrenDetails[index]?.age || ''}
                                                onChange={(e) => {
                                                    const newChildrenDetails = [...(formData.childrenDetails || [])];
                                                    newChildrenDetails[index] = {
                                                        ...newChildrenDetails[index],
                                                        age: e.target.value
                                                    };
                                                    handleChange('childrenDetails', newChildrenDetails);
                                                }}
                                                InputProps={{ inputProps: { min: 0 } }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Grid>
                );

            case 3:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Interests (comma separated)"
                                value={formData.interests.join(', ')}
                                onChange={(e) => handleChange('interests', e.target.value.split(',').map(s => s.trim()))}
                            />
                            <Box sx={{ mt: 1 }}>
                                {formData.interests.map((interest, index) => (
                                    <Chip
                                        key={index}
                                        label={interest}
                                        onDelete={() => {
                                            const newInterests = [...formData.interests];
                                            newInterests.splice(index, 1);
                                            handleChange('interests', newInterests);
                                        }}
                                        sx={{ m: 0.5 }}
                                    />
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Preferred Event Types</InputLabel>
                                <Select
                                    multiple
                                    value={formData.preferredEventTypes}
                                    onChange={(e) => handleChange('preferredEventTypes', e.target.value)}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    <MenuItem value="conference">Conference</MenuItem>
                                    <MenuItem value="workshop">Workshop</MenuItem>
                                    <MenuItem value="networking">Networking</MenuItem>
                                    <MenuItem value="social">Social</MenuItem>
                                    <MenuItem value="sports">Sports</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Notification Preferences
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.notificationSettings.email}
                                        onChange={(e) => handleNestedChange('notificationSettings', 'email', e.target.checked)}
                                    />
                                }
                                label="Email Notifications"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.notificationSettings.push}
                                        onChange={(e) => handleNestedChange('notificationSettings', 'push', e.target.checked)}
                                    />
                                }
                                label="Push Notifications"
                            />
                        </Grid>
                    </Grid>
                );

            case 4:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="profile-picture"
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleChange('profilePicture', e.target.files[0]);
                                    }
                                }}
                            />
                            <label htmlFor="profile-picture">
                                <IconButton
                                    color="primary"
                                    component="span"
                                    sx={{ mb: 2 }}
                                >
                                    <Avatar
                                        src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : ''}
                                        sx={{ width: 120, height: 120 }}
                                    />
                                    <PhotoCamera sx={{ position: 'absolute', bottom: 0, right: 0 }} />
                                </IconButton>
                            </label>
                            <Typography variant="body2" color="text.secondary">
                                Click to upload profile picture
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Bio"
                                multiline
                                rows={4}
                                value={formData.bio}
                                onChange={(e) => handleChange('bio', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Social Links
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="LinkedIn"
                                        value={formData.socialLinks.linkedin}
                                        onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Twitter"
                                        value={formData.socialLinks.twitter}
                                        onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Instagram"
                                        value={formData.socialLinks.instagram}
                                        onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3
        }}>
            <StyledPaper elevation={3}>
                <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
                    Welcome to Eventifyy
                </Typography>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {renderStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : activeStep === steps.length - 1 ? (
                            'Finish'
                        ) : (
                            'Next'
                        )}
                    </Button>
                </Box>
            </StyledPaper>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OnboardingForm; 