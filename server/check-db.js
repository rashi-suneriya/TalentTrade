require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

async function checkCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const courses = await Course.find({}).select('title curriculum');
    console.log('Courses found:', courses.length);
    courses.forEach(c => {
      console.log(`Course: ${c.title}`);
      c.curriculum.forEach(s => {
        console.log(`  Section: ${s.sectionTitle}`);
        s.lessons.forEach(l => {
          console.log(`    Lesson: ${l.title}, VideoURL: ${l.videoUrl || 'EMPTY'}`);
        });
      });
    });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCourses();
