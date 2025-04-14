"use client";

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Switch,
    FormControlLabel,
    CircularProgress,
    Snackbar,
    Alert,
    Avatar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { baseUrl } from 'src/config/api';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useUserStore } from 'src/store/useStore';
// import { useSnackbar } from 'notistack';
import { PhotoCamera } from '@mui/icons-material';

const Page = () => {
    const [userDetails, setUserDetails] = useUserStore(state => [state.userDetailsStore, state.updateUserDetails])
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    // const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: null,
        gender: '',
        address: '',
        profilePicture: '',
        interests: [],
        preferences: {
            eventTypes: [],
            notificationSettings: {
                email: true,
                push: true
            }
        },
        bio: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userDetails?._id) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(baseUrl + `users/${userDetails._id}`);
                const userData = response.data;

                setFormData({
                    name: userData.name || userDetails?.name,
                    email: userData.email || userDetails?.email,
                    phone: userData.phone || userDetails?.phone,
                    dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
                    gender: userData.gender || '',
                    address: userData.address || userDetails?.address,
                    profilePicture: userData.profilePicture || '',
                    interests: userData.interests || [],
                    preferences: {
                        eventTypes: userData.preferences?.eventTypes || [],
                        notificationSettings: {
                            email: userData.preferences?.notificationSettings?.email ?? true,
                            push: userData.preferences?.notificationSettings?.push ?? true
                        }
                    },
                    bio: userData.bio || ''
                });

                if (userData.profilePicture) {
                    setPreviewUrl(baseUrl + userData.profilePicture);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setSnackbar({
                    open: true,
                    message: 'Failed to load profile',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userDetails]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('profilePicture', file);
            formData.append('id', userDetails._id);

            const response = await axios.patch(baseUrl + 'uploads/profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.profilePicture) {
                setFormData(prev => ({
                    ...prev,
                    profilePicture: response.data.profilePicture
                }));
                // enqueueSnackbar('Profile picture updated successfully', { variant: 'success' });
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            // enqueueSnackbar('Failed to update profile picture', { variant: 'error' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userDetails?._id) return;

        setSaving(true);
        try {
            // First upload the profile picture if it exists
            if (profilePicture) {
                const formData = new FormData();
                formData.append('profilePicture', profilePicture);
                formData.append('id', userDetails._id);
                const uploadResponse = await axios.post(
                    baseUrl + 'uploads/profile-picture',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                setFormData(prev => ({
                    ...prev,
                    profilePicture: uploadResponse.data.profilePicture
                }));
            }

            // Prepare the data to be sent to the server
            const updateData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address,
                profilePicture: formData.profilePicture,
                interests: formData.interests,
                preferences: formData.preferences,
                bio: formData.bio
            };

            // Update the user profile
            const response = await axios.put(baseUrl + `users/${userDetails._id}`, updateData);

            // Update the user details in the store
            useUserStore.setState({ userDetails: { ...userDetails, ...response.data } });

            setSnackbar({
                open: true,
                message: 'Profile updated successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.msg || 'Failed to update profile',
                severity: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Profile Settings
            </Typography>

            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        src={formData.profilePicture}
                                        sx={{ width: 120, height: 120 }}
                                    />
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<PhotoCamera />}
                                    >
                                        Upload Profile Picture
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                        />
                                    </Button>
                                    <Typography variant="caption" color="text.secondary">
                                        Supported formats: JPG, PNG, GIF (max 5MB)
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Date of Birth"
                                        value={formData.dateOfBirth}
                                        onChange={(newValue) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                dateOfBirth: newValue
                                            }));
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth required />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
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
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    name="bio"
                                    multiline
                                    rows={4}
                                    value={formData.bio}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Notification Preferences
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.preferences.notificationSettings.email}
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    preferences: {
                                                        ...prev.preferences,
                                                        notificationSettings: {
                                                            ...prev.preferences.notificationSettings,
                                                            email: e.target.checked
                                                        }
                                                    }
                                                }));
                                            }}
                                        />
                                    }
                                    label="Email Notifications"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.preferences.notificationSettings.push}
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    preferences: {
                                                        ...prev.preferences,
                                                        notificationSettings: {
                                                            ...prev.preferences.notificationSettings,
                                                            push: e.target.checked
                                                        }
                                                    }
                                                }));
                                            }}
                                        />
                                    }
                                    label="Push Notifications"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={saving}
                                    sx={{ mt: 2 }}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
