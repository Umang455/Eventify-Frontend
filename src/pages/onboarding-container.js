import { useState } from 'react';
import { Box } from '@mui/material';
import OnboardingForm from './onboarding';
import Dashboard from './dashboard';

const OnboardingContainer = () => {
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
    const [user, setUser] = useState(null);

    const handleOnboardingComplete = (userData) => {
        setUser(userData);
        setIsOnboardingComplete(true);
    };

    return (
        <Box>
            {!isOnboardingComplete ? (
                <OnboardingForm onComplete={handleOnboardingComplete} />
            ) : (
                <Dashboard user={user} />
            )}
        </Box>
    );
};

export default OnboardingContainer; 