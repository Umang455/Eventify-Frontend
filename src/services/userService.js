import axios from 'axios';
import { baseUrl } from 'src/config/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const updateUserProfile = async (userId, formData) => {
    try {
        const response = await axios.patch(
            baseUrl + `/users/profile/${userId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const getUserProfile = async (userId) => {
    try {
        const response = await axios.get(
            `${API_URL}/users/${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}; 