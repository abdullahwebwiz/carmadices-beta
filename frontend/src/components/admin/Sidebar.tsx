import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faXmark, faList, faUserGroup, faUserGear, faMoneyBill, faDashboard } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/mycarmedics-logo-white.svg';
import { useAuth } from '../../contexts/authContext';

const AdminSidebar = ({ logout }) => {
    const { user } = useAuth();
    const location = useLocation();

    return (
        <div className="flex flex-col items-center bg-black text-white">
            <div className="py-8 lg:flex hidden flex-col items-center">
                <Link to="/">
                    <img src={logo} className="lg:w-32 lg:flex hidden mb-4" alt="Logo" />
                </Link>
                {user && user.firstName && <p className="lg:flex hidden">Hi&nbsp;<strong>{user.firstName}!</strong></p>}
            </div>
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col">
                    <Link to="/admin" className={`text-xl font-bold px-4 py-8 ${location.pathname === '/admin' ? 'bg-white/10' : ''}`}>
                        <FontAwesomeIcon icon={faDashboard} className="w-4 lg:mr-3" /><p className="lg:inline hidden">Dashboard</p>
                    </Link>
                    <Link to="/admin/orders" className={`text-xl font-bold px-4 py-8 ${location.pathname === '/admin/orders' ? 'bg-white/10' : ''}`}>
                        <FontAwesomeIcon icon={faList} className="w-4 lg:mr-3" /><p className="lg:inline hidden">Orders</p>
                    </Link>
                    <Link to="/admin/customers" className={`text-xl font-bold px-4 py-8 ${location.pathname === '/admin/customers' ? 'bg-white/10' : ''}`}>
                        <FontAwesomeIcon icon={faUserGroup} className="w-4 lg:mr-3" /><p className="lg:inline hidden">Customers</p>
                    </Link>
                    <Link to="/admin/providers" className={`text-xl font-bold px-4 py-8 ${location.pathname === '/admin/providers' ? 'bg-white/10' : ''}`}>
                        <FontAwesomeIcon icon={faUserGear} className="w-4 lg:mr-3" /><p className="lg:inline hidden">Providers</p>
                    </Link>
                    <Link to="/admin/payouts" className={`text-xl font-bold px-4 py-8 ${location.pathname === '/admin/payouts' ? 'bg-white/10' : ''}`}>
                        <FontAwesomeIcon icon={faMoneyBill} className="w-4 lg:mr-3" /><p className="lg:inline hidden">Payouts</p>
                    </Link>
                </div>
                <div className="mt-auto">
                <p onClick={logout} className="text-xl font-bold px-4 py-8">
                <FontAwesomeIcon icon={faXmark} className="w-4 lg:mr-3" /><span className="lg:inline hidden">Logout</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
