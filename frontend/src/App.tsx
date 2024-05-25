import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import LandingPage from './screens/LandingPage';
import LoginForm from './screens/Login';
import Register from './screens/Register';
import UserProfile from './screens/user/Profile';
import Orders from './screens/admin/Orders';
import CustomersPage from './screens/admin/Customers';
import ProvidersPage from './screens/admin/Providers';
import AdminPage from './screens/admin/Dashboard';
import PayoutsPage from './screens/admin/Payouts';
import ProviderDashboard from './screens/provider/Dashboard';
import ProviderOrders from './screens/provider/Orders';
import ProviderPayouts from './screens/provider/Payouts';
import PartnerPage from './screens/Partner';
import DealersPage from './screens/Dealers';
import ThankYouPage from './screens/ThankYouPage';
import Order from './screens/user/orderform';
import PayTest from './screens/PayTest';


const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        <Route path="/*" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/orderform" element={<Order />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/customers" element={<CustomersPage />} />
          <Route path="/admin/providers" element={<ProvidersPage />} />
          <Route path="/admin/payouts" element={<PayoutsPage />} />
          <Route path="/provider" element={<ProviderDashboard/>} />
          <Route path="/provider/orders" element={<ProviderOrders/>} />
          <Route path="/provider/payouts" element={<ProviderPayouts/>} />
          <Route path="/partner" element={<PartnerPage/>} />
          <Route path="/dealers" element={<DealersPage/>} />
          <Route path="/paytest" element={<PayTest/>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
