import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            // Assuming you have a route like /auth/validate to validate tokens
            try {
                await axios.get('/auth/validate');
                // If successful, do nothing or update state as necessary
            } catch (error : any) {
                if (error.response && error.response.status === 401) {
                    // If unauthorized, clear token and redirect
                    localStorage.removeItem('userToken');
                    navigate('/login'); // Redirect to login or other appropriate page
                }
                // Handle other errors as necessary
            }
        };

        const token = localStorage.getItem('userToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            checkAuth();
        }
    }, [navigate]);
};

export default useAuthCheck;
