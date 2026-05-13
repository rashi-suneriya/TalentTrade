import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import AiTutor from '../components/ai/AiTutor';
import LessonResources from '../components/course/LessonResources';
import Button from '../components/ui/Button';
import { 
  ChevronRight, ChevronLeft, CheckCircle, Play, FileText, Bot, 
  List, Paperclip, HelpCircle, Video, ExternalLink, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';

// ── Live Session Banner ────────────────────────────────────────────────
const LiveSessionBanner = ({ session }) => {
  if (!session?.date) return null;
  const sessionDate = new Date(session.date);
  const isUpcoming = sessionDate > new Date();
  if (!isUpcoming) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-6 mt-4 p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-500/30"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Video className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold opacity-80 uppercase tracking-wider">Live Session</div>
          <div className="font-bold">
            {sessionDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs opacity-70">{session.platform} · {session.duration} min</div>
        </div>
      </div>
      <a href={session.link} target="_blank" rel="noopener noreferrer">
        <button className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all whitespace-nowrap">
          Join Session <ExternalLink className="w-4 h-4" />
        </button>
      </a>
    </motion.div>
  );
};

// ── Quiz Tab ─────────────────────────────────────────────────────────
const QuizTab = ({ questions }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">No Quiz Available</h3>
        <p className="text-sm text-slate-400">The teacher hasn't added quiz questions yet.</p>
      </div>
    );
  }

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="p-5 space-y-6">
      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-5 rounded-2xl text-center ${
            score === questions.length 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' 
              : 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
          }`}
        >
          <div className="text-3xl font-black text-slate-800 dark:text-white">{score}/{questions.length}</div>
          <div className="text-sm font-bold text-slate-500 mt-1">
            {score === questions.length ? '🎉 Perfect Score!' : score >= questions.length / 2 ? '👍 Good Job!' : '📚 Keep Practicing!'}
          </div>
          <button onClick={handleReset} className="mt-3 text-xs font-bold text-indigo-600 hover:underline">Try Again</button>
        </motion.div>
      )}

      {questions.map((q, qIdx) => {
        const isAnswered = answers[qIdx] !== undefined;
        const isCorrect = submitted && answers[qIdx] === q.correctAnswer;
        const isWrong = submitted && isAnswered && answers[qIdx] !== q.correctAnswer;

        return (
          <div key={qIdx} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4">
            <div className="flex gap-3">
              <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {qIdx + 1}
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">{q.question}</p>
            </div>
            <div className="space-y-2">
              {q.options.map((opt, oIdx) => {
                let optClass = 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20';
                if (!submitted && answers[qIdx] === oIdx) optClass = 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300';
                if (submitted && oIdx === q.correctAnswer) optClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
                if (submitted && answers[qIdx] === oIdx && oIdx !== q.correctAnswer) optClass = 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300';

                return (
                  <label key={oIdx} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${optClass}`}>
                    <input
                      type="radio"
                      name={`q-${qIdx}`}
                      value={oIdx}
                      checked={answers[qIdx] === oIdx}
                      onChange={() => !submitted && setAnswers({ ...answers, [qIdx]: oIdx })}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${answers[qIdx] === oIdx ? 'border-current bg-current' : 'border-current'}`}>
                      {answers[qIdx] === oIdx && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm font-medium">{opt}</span>
                  </label>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Explanation</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{q.explanation}</p>
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <Button 
          className="w-full h-12" 
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
        >
          Submit Quiz
        </Button>
      )}
    </div>
  );
};

// ── Main LearnPage ────────────────────────────────────────────────────
const LearnPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('curriculum');
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        if (res.data.success) {
          setCourse(res.data.course);
          const firstLesson = res.data.course.curriculum.find(s => s.lessons.length > 0)?.lessons[0];
          if (firstLesson) {
            setCurrentLesson(firstLesson);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-bold">Loading course...</div>;
  if (!course) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Course not found.</div>;

  const allLessons = course.curriculum.flatMap(s => s.lessons);
  const currentIndex = allLessons.findIndex(l => (l._id?.toString() || l._id) == (currentLesson?._id?.toString() || currentLesson?._id));
  
  console.log('LearnPage Render - Current Lesson:', currentLesson?.title, 'Video URL:', currentLesson?.videoUrl);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Left: Video & Info */}
        <div className="flex-1 overflow-y-auto bg-slate-900">
          {/* Live Session Banner */}
          <LiveSessionBanner session={currentLesson?.liveSession} />

          <div className="aspect-video bg-black sticky top-0 z-10 shadow-2xl overflow-hidden">
            {currentLesson?.videoUrl ? (
              <div className="w-full h-full relative">
                <ReactPlayer
                  key={`${currentLesson._id}-${currentLesson.videoUrl}`}
                  url={currentLesson.videoUrl && currentLesson.videoUrl.includes('cloudinary.com') && !currentLesson.videoUrl.match(/\.(mp4|webm|mov|avi)$/i) 
                    ? `${currentLesson.videoUrl}.mp4` 
                    : currentLesson.videoUrl}
                  controls
                  width="100%"
                  height="100%"
                  playing={false}
                  config={{
                    file: {
                      attributes: {
                        crossOrigin: 'anonymous',
                        preload: 'auto',
                        playsInline: true,
                        style: { objectFit: 'contain', background: '#000' }
                      }
                    }
                  }}
                  onError={(e) => {
                    console.error('Video error:', e);
                    setVideoError(true);
                  }}
                  onReady={() => setVideoError(false)}
                />
              </div>
            ) : currentLesson ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                <Video className="w-16 h-16 opacity-20" />
                <p>No video available for this lesson</p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                <Play className="w-16 h-16 opacity-20" />
                <p>Select a lesson to start learning</p>
              </div>
            )}
            
            {videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white p-6 text-center z-20">
                <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-4">
                  <Video className="w-8 h-8" />
                </div>
                <h3 className="font-bold mb-2">Video Loading Failed</h3>
                <p className="text-sm text-slate-400 max-w-xs mb-2">We couldn't load the video. This might be due to an invalid URL or browser restriction.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button 
                    onClick={() => {
                      setVideoError(false);
                      // ReactPlayer handles reload internally if URL stays the same
                    }}
                    variant="secondary"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Try Reloading
                  </Button>
                  {currentLesson?.videoUrl && (
                    <a 
                      href={currentLesson.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-all"
                    >
                      Open Direct Link <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 lg:p-10 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">{currentLesson?.title}</h1>
                <p className="text-slate-400 flex items-center gap-2">{course.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="secondary" 
                  className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                  onClick={() => currentIndex > 0 && setCurrentLesson(allLessons[currentIndex - 1])}
                  disabled={currentIndex <= 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Button>
                <Button
                  onClick={() => currentIndex < allLessons.length - 1 && setCurrentLesson(allLessons[currentIndex + 1])}
                  disabled={currentIndex >= allLessons.length - 1}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" /> About this Lesson
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {currentLesson?.description || 'No description for this lesson.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="w-full lg:w-[420px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 scrollbar-hide">
            {[
              { id: 'curriculum', icon: <List className="w-4 h-4" />, label: 'Curriculum' },
              { id: 'quiz', icon: <HelpCircle className="w-4 h-4" />, label: 'Quiz' },
              { id: 'ai', icon: <Bot className="w-4 h-4" />, label: 'AI Tutor' },
              { id: 'resources', icon: <Paperclip className="w-4 h-4" />, label: 'Resources' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-4 px-3 text-[11px] font-bold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'curriculum' && (
                <motion.div key="curriculum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-6">
                  {course.curriculum.map((section, idx) => (
                    <div key={idx}>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-2">{section.sectionTitle}</h3>
                      <div className="space-y-1">
                        {section.lessons.map((lesson) => (
                          <button
                            key={lesson._id}
                            onClick={() => { setCurrentLesson(lesson); setActiveTab('curriculum'); }}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                              (currentLesson?._id?.toString() || currentLesson?._id) == (lesson._id?.toString() || lesson._id)
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              (currentLesson?._id?.toString() || currentLesson?._id) == (lesson._id?.toString() || lesson._id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                            }`}>
                              {lesson.isCompleted ? <CheckCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold truncate">{lesson.title}</div>
                              <div className="text-[10px] opacity-60 flex items-center gap-1.5">
                                {lesson.videoUrl && 'Video'}
                                {lesson.quiz?.length > 0 && ' · Quiz'}
                                {lesson.liveSession?.date && ' · Live'}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <QuizTab questions={currentLesson?.quiz || []} />
                </motion.div>
              )}

              {activeTab === 'ai' && (
                <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
                  <AiTutor courseId={id} lessonId={currentLesson?._id} />
                </motion.div>
              )}

              {activeTab === 'resources' && (
                <motion.div key="resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                  <LessonResources
                    courseId={id}
                    lessonId={currentLesson?._id}
                    resources={currentLesson?.resources || []}
                    editable={false}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
