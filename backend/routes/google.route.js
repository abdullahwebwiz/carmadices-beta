const express = require('express');
const {Client} = require("@googlemaps/google-maps-services-js");
const app = express();

app.get('/calculate-distance', async (req, res) => {
  const client = new Client({});
  try {
    const response = await client.distancematrix({
      params: {
        origins: [req.query.origin], // e.g., "New York, NY"
        destinations: [req.query.destination], // e.g., "Los Angeles, CA"
        key: "AIzaSyBicqLbBwIcUWyaEOvfB8GXRbtHkTN-K-o",
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

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
