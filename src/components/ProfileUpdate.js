import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Avatar,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { updateUserProfile } from '../services/userService';

const ProfileUpdate = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(user.profileImage || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('bio', formData.bio);
            if (profileImage) {
                data.append('profileImage', profileImage);
            }

            const updatedUser = await updateUserProfile(user._id, data);
            onUpdate(updatedUser);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Update Profile
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                    src={previewImage}
                    sx={{ width: 120, height: 120, mb: 2 }}
                />
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                    type="file"
                    onChange={handleImageChange}
                />
                <label htmlFor="profile-image-upload">
                    <IconButton color="primary" component="span">
                        <PhotoCamera />
                    </IconButton>
                </label>
            </Box>

            <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
            />

            <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
            />

            <TextField
                fullWidth
                label="Bio"
                name="bio"
                multiline
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                margin="normal"
            />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Profile updated successfully!
                </Alert>
            )}

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
            </Button>
        </Box>
    );
};

export default ProfileUpdate; 