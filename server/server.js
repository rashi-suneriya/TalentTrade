require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./socket');
const expireSwaps = require('./jobs/expireSwaps.job');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Start Cron Jobs
expireSwaps();

server.timeout = 600000; // 10 minutes
server.keepAliveTimeout = 61000;
server.headersTimeout = 62000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
