require('dotenv').config(); // Load environment variables from .env file

const https = require('https');
const fs = require('fs');
const express = require("express");
const compression = require('compression');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoute = require('./routes/product.route.js');
const userRoute = require('./routes/user.route.js');
const ordersRoute = require('./routes/order.route.js');
const paymentRoute = require('./routes/payment.route.js');
const adminRoutes = require('./routes/admin.route');
const providerRoute = require('./routes/provider.route.js');
const authenticateToken = require("./middleware/authenticateToken");
const requireAdmin = require("./middleware/requireAdmin");
const requireProvider = require('./middleware/requireProvider.js');
const {Client} = require("@googlemaps/google-maps-services-js");
const path = require('path');

const PORT = process.env.PORT || 8080;
const app = express();

// Enable gzip compression
app.use(compression());

// For accepting JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/user', userRoute);
app.use('/api/products', productRoute);
app.use('/order', ordersRoute);
app.use('/payment', paymentRoute);
app.use('/admin', authenticateToken, requireAdmin, adminRoutes);
app.use('/provider', authenticateToken, requireProvider, providerRoute);

// Google Maps Distance Matrix API route
app.get('/calculate-distance', async (req, res) => {
    const client = new Client({});
    try {
      const response = await client.distancematrix({
        params: {
          origins: [req.query.origin], // "New York, NY"
          destinations: [req.query.destination], // "Los Angeles, CA"
          key: process.env.GOOGLE_MAPS_API_KEY, // Access API key securely
        },
        timeout: 1000, // milliseconds
      });
  
      const distance = response.data.rows[0].elements[0].distance;
      const duration = response.data.rows[0].elements[0].duration;
      res.json({distance: distance.text, duration: duration.text});
    } catch (e) {
      res.status(500).send(e.toString());
    }
  });

app.get('/', (req, res) => {
    res.send("Hello from Node API");
});

// Serve static images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to database!");
        // Create HTTPS server
        const httpsOptions = {
          key: fs.readFileSync('/home/carmedic/htdocs/www.mycarmedics.com/carmedics/backend/cert/www.mycarmedics.com.key'),
          cert: fs.readFileSync('/home/carmedic/htdocs/www.mycarmedics.com/carmedics/backend/cert/www.mycarmedics.com.crt'),
        };
        https.createServer(httpsOptions, app).listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT} with HTTPS.`);
        });
    })
    .catch((err) => {
        console.error("Connection failed:", err);
    });
