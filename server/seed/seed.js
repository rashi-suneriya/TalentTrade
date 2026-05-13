const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Course = require('../models/Course');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();

    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash('password123', salt);

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@talenttrade.com',
      password,
      role: 'admin',
      isVerified: true,
      tokens: 9999
    });

    // Create Teachers
    const teacher1 = await User.create({
      name: 'Sarah Drasner',
      email: 'sarah@example.com',
      password,
      role: 'teacher',
      isVerified: true,
      bio: 'Expert React developer and author.',
      skillsOffered: [{ title: 'React', level: 'advanced', category: 'Technology' }]
    });

    const teacher2 = await User.create({
      name: 'Gary Simon',
      email: 'gary@example.com',
      password,
      role: 'teacher',
      isVerified: true,
      bio: 'Professional UI/UX designer and YouTuber.',
      skillsOffered: [{ title: 'UI Design', level: 'advanced', category: 'Design' }]
    });

    // Create Courses
    await Course.create([
      {
        title: 'Advanced React Patterns',
        description: 'Master higher-order components, render props, and hooks.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        category: 'Technology',
        level: 'advanced',
        teacher: teacher1._id,
        isPublished: true,
        publishedAt: new Date(),
        price: 50,
        totalLessons: 12,
        curriculum: [
          {
            sectionTitle: 'Getting Started',
            lessons: [
              { title: 'Introduction', description: 'Welcome to the course!', videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0', isFree: true }
            ]
          }
        ]
      },
      {
        title: 'UI Design for Developers',
        description: 'Learn how to make your apps look professional and beautiful.',
        thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=800',
        category: 'Design',
        level: 'beginner',
        teacher: teacher2._id,
        isPublished: true,
        publishedAt: new Date(),
        price: 0,
        totalLessons: 8,
        curriculum: [
          {
            sectionTitle: 'Fundamentals',
            lessons: [
              { title: 'Color Theory', description: 'Basics of color in UI.', videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0', isFree: true }
            ]
          }
        ]
      }
    ]);

    console.log('Seed data created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
