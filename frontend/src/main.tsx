import React from 'react';
import ReactDOM from 'react-dom/client';
// import { LoadScript } from '@react-google-maps/api';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      {/* <LoadScript googleMapsApiKey={'AIzaSyBicqLbBwIcUWyaEOvfB8GXRbtHkTN-K-o'} libraries={["places"]} language="en"> */}
        <App />
      {/* </LoadScript> */}
  </React.StrictMode>
)
