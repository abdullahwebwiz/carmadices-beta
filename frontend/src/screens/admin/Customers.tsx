import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import AdminSidebar from '../../components/admin/Sidebar'; // Import the AdminSidebar component
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const CustomersPage = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('https://carmadices-beta-11pk.vercel.app/admin/fetch-users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                });
                if (response.data.status === 'SUCCESS') {
                    setCustomers(response.data.users);
                    setFilteredCustomers(response.data.users);
                } else {
                    console.error('Failed to fetch customers. Status:', response.data.status);
                }
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            } finally {
                setLoading(false); // Update loading state regardless of success or failure
            }
        };

        const checkAdminStatus = async () => {
            if (isAdmin) {
                fetchCustomers();
            } else {
                navigate('/login');
            }
        };

        if (isAdmin) {
            checkAdminStatus();
        }
    }, [isAdmin, navigate]);

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);

        const filtered = customers.filter((customer) =>
            customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCustomers(filtered);
    };

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <AdminSidebar logout={logout} />
            {/* Content Area */}
            <div className="bg-blue/25 flex-1 overflow-y-auto">
                <h1 className="p-8 lg:text-5xl text-4xl font-black bg-gray-800 text-white text-center lg:text-left">Customers</h1>
                <div className="lg:p-8 p-4">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="border rounded-lg p-2 w-full mb-4"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex w-full items-center justify-center">
                                <ThreeDots visible={true} height="30" width="40" color="#0072DC" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" />
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-blue">
                                    <tr className="h-14">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">First Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCustomers && filteredCustomers.length > 0 ? (
                                        filteredCustomers.map((customer) => (
                                            <tr key={customer._id} className="hover:bg-gray-100">
                                                <td className="px-6 py-4 whitespace-nowrap">{customer.firstName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{customer.phone}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                                    <button className="text-red-600 hover:text-red-900 ml-2">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center">No customers found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomersPage;
