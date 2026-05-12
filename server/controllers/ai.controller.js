const OpenAI = require('openai');
const AiChat = require('../models/AiChat');
const Course = require('../models/Course');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// @desc    Ask AI Tutor
// @route   POST /api/ai/ask
// @access  Private
exports.askAI = async (req, res) => {
  try {
    const { courseId, lessonId, message } = req.body;
    const userId = req.user._id;

    // 1. Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let chat = await AiChat.findOne({ user: userId, course: courseId, lessonId });
    if (!chat) {
      chat = await AiChat.create({ user: userId, course: courseId, lessonId, lastQueryDate: today });
    }

    if (chat.lastQueryDate < today) {
      chat.queryCount = 0;
      chat.lastQueryDate = today;
    }

    if (chat.queryCount >= 20) {
      return res.status(429).json({ success: false, message: 'Daily limit reached (20/20). Resets tomorrow.' });
    }

    // 2. Build context
    const course = await Course.findById(courseId);
    let lessonInfo = "";
    course.curriculum.forEach(section => {
      const lesson = section.lessons.find(l => l._id.toString() === lessonId);
      if (lesson) {
        lessonInfo = `Lesson Title: ${lesson.title}. Description: ${lesson.description}`;
      }
    });

    const messages = [
      {
        role: "system",
        content: `You are an expert tutor for the course: "${course.title}". 
                  The student is on lesson: "${lessonInfo}". 
                  Rules: 
                  - Be concise (under 120 words)
                  - Use simple language
                  - Give examples
                  - Use Markdown for code
                  - Encourage the student
                  - Stay on topic`
      },
      ...chat.messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: message }
    ];

    // 3. Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;

    // 4. Save and return
    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "assistant", content: reply });
    chat.queryCount += 1;
    await chat.save();

    res.json({ success: true, reply, queriesLeft: 20 - chat.queryCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get chat history
// @route   GET /api/ai/history/:lessonId
// @access  Private
exports.getChatHistory = async (req, res) => {
  try {
    const chat = await AiChat.findOne({ user: req.user._id, lessonId: req.params.lessonId });
    if (!chat) return res.json({ success: true, messages: [], queriesLeft: 20 });
    
    // Check if it's a new day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const queriesLeft = chat.lastQueryDate < today ? 20 : 20 - chat.queryCount;

    res.json({ success: true, messages: chat.messages, queriesLeft });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
