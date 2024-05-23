import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const API_BASE_URL = 'https://carmadices-beta-11pk.vercel.app/';

// Define your axios instance
const instance = axios.create({
    baseURL: API_BASE_URL, // Corrected
});

// Define types for user data
interface User {
    userId: string; // Add userId property
    email: string;
    token: string;
    isAdmin: boolean;
    isProvider: boolean;
}

// Define context type
interface AuthContextType {
    user: User | null;
    userToken: string | null; // Add userToken
    isAdmin: boolean;
    isProvider: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loginError: string | null;
    fetchProfileData: () => Promise<void>;
    updateProfileData: (profileData: Partial<User>) => Promise<{ success: boolean; message: string }>;
    orders: any[]; // Update with correct order type
    fetchOrders: () => Promise<void>;
    ordersLoading: boolean;
    ordersError: string | null;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType>({
    user: null,
    userToken: localStorage.getItem('userToken'), // Set userToken here
    isAdmin: false,
    isProvider: false,
    login: async () => {},
    logout: () => {},
    loginError: null,
    fetchProfileData: async () => {},
    updateProfileData: async () => ({ success: false, message: '' }),
    orders: [],
    fetchOrders: async () => {},
    ordersLoading: false,
    ordersError: null,
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProvider, setIsProvider] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [orders, setOrders] = useState<any[]>([]); // Update with correct order type
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState<string | null>(null);
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            if (!isTokenExpired(token)) {
                fetchProfileData();
            } else {
                console.log('Token expired. Logging out.');
                performLogout();
            }
        }
    }, []); 

    
    const isTokenExpired = (token: string): boolean => {
        try {
            const payloadBase64 = token.split('.')[1];
            const decodedJson = atob(payloadBase64);
            const decoded = JSON.parse(decodedJson);
            const exp = decoded.exp * 1000;
            const isExpired = Date.now() > exp;
            return isExpired;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    };

    const fetchProfileData = async () => {
        const token = localStorage.getItem('userToken');
        if (!token || isTokenExpired(token)) return performLogout();
    
        try {
            const response = await instance.get('/user/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data && response.data.status === 'SUCCESS') {
                setUser(response.data.user);
                setIsAdmin(response.data.user.isAdmin);
                setIsProvider(response.data.user.isProvider);
            } else {
                performLogout();
            }
        } catch (error) {
            const axiosError = error as AxiosError; // Assuming AxiosError is imported from 'axios'
            if (axiosError.response && [401, 403].includes(axiosError.response.status)) {
                performLogout();
            } else {
                console.error('Error fetching user profile:', error);
            }
        }
        
    };
    
    const updateProfileData = async (profileData: Partial<User>) => {
        const token = localStorage.getItem('userToken');
        if (!token) return { success: false, message: 'No authentication token found.' };

        try {
            const { userId, ...userData } = profileData;
            const response = await instance.put('/user/profile/update', userData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && response.data.status === 'SUCCESS') {
                setUser(profileData);
                return { success: true, message: 'Profile updated successfully' };
            } else {
                return { success: false, message: 'Failed to update profile' };
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            return { success: false, message: 'Failed to update profile' };
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await instance.post('/user/signin', { email, password });
            const { data } = response;
            const { token, data: userData } = data;
            
            if (data.status === "SUCCESS") {
                setUserToken(token);
                setUser(userData);
                localStorage.setItem('userToken', token);
                localStorage.setItem('userId', userData.userId); // Save userId in local storage
                setIsAdmin(userData.isAdmin);
                setIsProvider(userData.isProvider);
                navigate('/profile');
            } else {
                setLoginError(data.message);
            }
        } catch (error) {
            setLoginError('An error occurred during login.');
        }
    };
    
    const fetchOrders = async () => {
        // Check if orders are already loading, there's an error, or there are already orders present
        if (ordersLoading || ordersError || orders.length > 0) {
            return; // Exit early to prevent unnecessary fetch
        }
    
        setOrdersLoading(true);
        const token = localStorage.getItem('userToken');
        try {
            const response = await instance.get('/order', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setOrders(response.data); // Directly use response.data as it's the expected array
            } else {
                throw new Error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrdersError(error.toString());
        } finally {
            setOrdersLoading(false);
        }
    };

    const performLogout = () => {
        localStorage.removeItem('userToken');
        setUserToken(null); // Clear the token state
        setUser(null);
        localStorage.removeItem('userId');
        setOrders([]); // Clear the orders state
        navigate('/'); // Redirect to the home page
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userToken,
                isAdmin,
                isProvider,
                login,
                logout: performLogout,
                loginError,
                fetchProfileData,
                updateProfileData,
                orders,
                fetchOrders,
                ordersLoading,
                ordersError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
