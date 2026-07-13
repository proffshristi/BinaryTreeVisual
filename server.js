const express = require('express');
const path = require('path');
const app = express();

// Serve the React build folder as static files
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all: send index.html for any route (needed for React Router, if you use it)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));