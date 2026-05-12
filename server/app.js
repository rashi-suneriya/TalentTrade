const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/auth.routes.js'));
app.use('/api/users', require('./routes/user.routes.js'));
app.use('/api/courses', require('./routes/course.routes.js'));
app.use('/api/lessons', require('./routes/lesson.routes.js'));
app.use('/api/enrollments', require('./routes/enrollment.routes.js'));
app.use('/api/swaps', require('./routes/swap.routes.js'));
app.use('/api/messages', require('./routes/message.routes.js'));
app.use('/api/notifications', require('./routes/notification.routes.js'));
app.use('/api/ai', require('./routes/ai.routes.js'));
app.use('/api/upload', require('./routes/upload.routes.js'));

app.get('/', (req, res) => {
  res.send('SkillSwap API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
