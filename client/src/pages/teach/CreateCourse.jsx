import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FileUpload from '../../components/ui/FileUpload';
import LessonResources from '../../components/course/LessonResources';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronRight, 
  Video, 
  FileText, 
  Layout, 
  List, 
  Check, 
  Paperclip,
  Image as ImageIcon,
  HelpCircle,
  Calendar,
  Settings,
  X,
  PlusCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    language: 'English',
    tags: [],
    price: 0,
    isFree: false,
    thumbnail: '',
    curriculum: [
      {
        sectionTitle: 'Getting Started',
        lessons: [
          { 
            title: 'Welcome to the course', 
            description: '', 
            videoUrl: '', 
            publicId: '',
            quiz: [],
            liveSession: {
              date: null,
              duration: 60,
              platform: 'Zoom',
              link: ''
            },
            resources: []
          }
        ]
      }
    ]
  });

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const res = await api.get(`/courses/${id}`);
          if (res.data.success) {
            setCourseData(res.data.course);
          }
        } catch (error) {
          toast.error('Failed to fetch course details');
          console.error(error);
        } finally {
          setIsFetching(false);
        }
      };
      fetchCourse();
    }
  }, [id]);

  const [tagInput, setTagInput] = useState('');

  const handleBasicInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData({ 
      ...courseData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!courseData.tags.includes(tagInput.trim())) {
        setCourseData({ ...courseData, tags: [...courseData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setCourseData({ ...courseData, tags: courseData.tags.filter(t => t !== tag) });
  };

  const addSection = () => {
    setCourseData({
      ...courseData,
      curriculum: [
        ...courseData.curriculum,
        { sectionTitle: 'New Section', lessons: [] }
      ]
    });
  };

  const removeSection = (sIdx) => {
    const newCurriculum = courseData.curriculum.filter((_, i) => i !== sIdx);
    setCourseData({ ...courseData, curriculum: newCurriculum });
  };

  const addLesson = (sIdx) => {
    const newCurriculum = [...courseData.curriculum];
    newCurriculum[sIdx].lessons.push({ 
      title: 'New Lesson', 
      description: '', 
      videoUrl: '', 
      publicId: '',
      quiz: [],
      liveSession: {
        date: null,
        duration: 60,
        platform: 'Zoom',
        link: ''
      },
      resources: []
    });
    setCourseData({ ...courseData, curriculum: newCurriculum });
  };

  const updateLesson = (sIdx, lIdx, data) => {
    const newCurriculum = [...courseData.curriculum];
    newCurriculum[sIdx].lessons[lIdx] = { ...newCurriculum[sIdx].lessons[lIdx], ...data };
    setCourseData({ ...courseData, curriculum: newCurriculum });
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const url = courseData._id ? `/courses/${courseData._id}` : '/courses';
      const method = courseData._id ? 'put' : 'post';
      const res = await api[method](url, courseData);
      
      if (res.data.success) {
        setCourseData(res.data.course);
        toast.success('Draft saved!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save draft');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 2) {
      const saved = await handleSaveDraft();
      if (saved) setStep(step + 1);
    } else if (step === 3) {
      const saved = await handleSaveDraft();
      if (saved) setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const saved = await handleSaveDraft();
      if (!saved) return;
      const res = await api.post(`/courses/${courseData._id}/publish`);
      if (res.data.success) {
        toast.success('Course published!');
        navigate(`/learn/${courseData._id}`);
      }
    } catch (error) {
      toast.error('Failed to publish');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      {isFetching ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-12">
          {[
            { n: 1, label: 'Basic Info', icon: <Layout className="w-4 h-4" /> },
            { n: 2, label: 'Thumbnail', icon: <ImageIcon className="w-4 h-4" /> },
            { n: 3, label: 'Curriculum', icon: <List className="w-4 h-4" /> },
            { n: 4, label: 'Review', icon: <Check className="w-4 h-4" /> }
          ].map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                step >= s.n ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step > s.n ? 'bg-emerald-500' : 'bg-black/10'
                }`}>
                  {step > s.n ? <Check className="w-4 h-4" /> : s.n}
                </span>
                <span className="text-sm font-bold hidden sm:block">{s.label}</span>
              </div>
              {i < 3 && <div className={`w-8 h-0.5 mx-2 ${step > s.n ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="card space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Course Title" name="title" value={courseData.title} onChange={handleBasicInfoChange} required />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Category</label>
                    <select name="category" className="input" value={courseData.category} onChange={handleBasicInfoChange}>
                      <option value="">Select Category</option>
                      <option value="Technology">Technology</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Music">Music</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 mb-1.5 block">Description</label>
                    <textarea name="description" className="input min-h-[120px] py-3" value={courseData.description} onChange={handleBasicInfoChange} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Level</label>
                    <select name="level" className="input" value={courseData.level} onChange={handleBasicInfoChange}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <Input label="Language" name="language" value={courseData.language} onChange={handleBasicInfoChange} />
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {courseData.tags.map(t => (
                        <span key={t} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full text-xs font-bold flex items-center gap-1">
                          {t} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(t)} />
                        </span>
                      ))}
                    </div>
                    <Input placeholder="Add tag and press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} />
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <input type="checkbox" name="isFree" checked={courseData.isFree} onChange={handleBasicInfoChange} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">This course is Free</label>
                  </div>
                  {!courseData.isFree && <Input label="Price (SkillTokens)" name="price" type="number" value={courseData.price} onChange={handleBasicInfoChange} />}
                </div>
              </div>
              <div className="flex justify-end"><Button className="px-10 h-12" onClick={handleNext}>Next: Thumbnail</Button></div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="card space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Thumbnail Upload</h2>
            <FileUpload 
              uploadUrl="/upload/image" 
              accept={['image/jpeg', 'image/png', 'image/webp']}
              label="Course Thumbnail" 
              onUpload={(data) => setCourseData({ ...courseData, thumbnail: data.url })} 
            />
          </div>
          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button className="px-10 h-12" onClick={handleNext}>Next: Curriculum</Button>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Curriculum Builder</h2>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleSaveDraft} isLoading={isLoading}>Save Draft</Button>
              <Button variant="secondary" onClick={addSection}><Plus className="w-4 h-4 mr-2" /> Add Section</Button>
            </div>
          </div>

          {courseData.curriculum.map((section, sIdx) => (
            <div key={sIdx} className="card p-0 overflow-hidden bg-white dark:bg-slate-900 shadow-xl border-slate-100 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <GripVertical className="w-5 h-5 text-slate-400" />
                <input className="bg-transparent border-none font-bold text-slate-800 dark:text-white focus:ring-0 text-lg flex-1" value={section.sectionTitle} onChange={(e) => {
                  const newCurr = [...courseData.curriculum];
                  newCurr[sIdx].sectionTitle = e.target.value;
                  setCourseData({ ...courseData, curriculum: newCurr });
                }} />
                <button onClick={() => removeSection(sIdx)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-2 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-6">
                {section.lessons.map((lesson, lIdx) => (
                  <LessonEditor key={lIdx} lesson={lesson} lIdx={lIdx} sIdx={sIdx} updateLesson={updateLesson} courseId={courseData._id} />
                ))}
                <button onClick={() => addLesson(sIdx)} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center font-bold">
                  <PlusCircle className="w-5 h-5 mr-2" /> Add New Lesson
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between pt-6">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button className="px-10 h-12" onClick={handleNext}>Next: Review</Button>
          </div>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8">
          <div className="card py-12 px-8 flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-[32px] flex items-center justify-center mb-8"><Check className="w-12 h-12" /></div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Ready to Launch!</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-10">Your course is all set. Review the details and hit publish to share your knowledge.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Sections</div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{courseData.curriculum.length}</div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Lessons</div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{courseData.curriculum.reduce((acc, s) => acc + s.lessons.length, 0)}</div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Price</div>
                <div className="text-3xl font-bold text-indigo-600">{courseData.isFree ? 'Free' : `${courseData.price} Tokens`}</div>
              </div>
            </div>
            <div className="flex gap-4 w-full max-w-sm">
              <Button variant="secondary" className="flex-1 h-12" onClick={() => setStep(3)}>Back</Button>
              <Button className="flex-1 h-12" isLoading={isLoading} onClick={handleSubmit}>Publish Now</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
        </main>
      )}
    </div>
  );
};

const LessonEditor = ({ lesson, lIdx, sIdx, updateLesson, courseId }) => {
const [activeTab, setActiveTab] = useState('content');

return (
<div className="border border-slate-100 dark:border-slate-800 rounded-[24px] overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 transition-all shadow-sm">
  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">{lIdx + 1}</div>
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <input className="bg-transparent border-none font-bold text-slate-800 dark:text-white focus:ring-0 w-full md:w-[250px]" value={lesson.title} onChange={(e) => updateLesson(sIdx, lIdx, { title: e.target.value })} />
        {lesson.quiz?.length > 0 && (
          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md uppercase">Quiz Added</span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-1">
      {['content', 'quiz', 'live', 'resources'].map(tab => (
        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          {tab === 'live' ? 'Live Session' : tab}
        </button>
      ))}
    </div>
  </div>

  <div className="p-6 min-h-[300px]">
    {activeTab === 'content' && (
      <div className="space-y-6">
        <textarea className="input min-h-[100px]" placeholder="Lesson summary..." value={lesson.description} onChange={(e) => updateLesson(sIdx, lIdx, { description: e.target.value })} />
        <FileUpload 
          uploadUrl="/upload/video" 
          accept={['video/mp4', 'video/webm', 'video/quicktime']}
          label="Lesson Video" 
          onUpload={(data) => updateLesson(sIdx, lIdx, { videoUrl: data.url, publicId: data.publicId })} 
        />
      </div>
    )}

        {activeTab === 'quiz' && <QuizEditor questions={lesson.quiz || []} setQuestions={(q) => updateLesson(sIdx, lIdx, { quiz: q })} />}

        {activeTab === 'live' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Session Date & Time</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <DatePicker 
                  selected={lesson.liveSession?.date ? new Date(lesson.liveSession.date) : null}
                  onChange={(date) => updateLesson(sIdx, lIdx, { liveSession: { ...lesson.liveSession, date } })}
                  showTimeSelect
                  dateFormat="Pp"
                  className="input pl-12 w-full"
                  placeholderText="Select date and time"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Clock className="w-4 h-4" /> Duration (min)</label>
              <Input type="number" value={lesson.liveSession?.duration} onChange={(e) => updateLesson(sIdx, lIdx, { liveSession: { ...lesson.liveSession, duration: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Platform</label>
              <select className="input" value={lesson.liveSession?.platform} onChange={(e) => updateLesson(sIdx, lIdx, { liveSession: { ...lesson.liveSession, platform: e.target.value } })}>
                <option value="Zoom">Zoom</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <Input label="Meeting Link" value={lesson.liveSession?.link} onChange={(e) => updateLesson(sIdx, lIdx, { liveSession: { ...lesson.liveSession, link: e.target.value } })} />
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2"><Paperclip className="w-4 h-4 text-indigo-500" /> Lesson Attachments</h4>
            {lesson._id ? (
              <LessonResources courseId={courseId} lessonId={lesson._id} resources={lesson.resources || []} editable={true} />
            ) : (
              <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                <p className="text-sm text-slate-500">Save draft first to enable resource uploads for this lesson.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const QuizEditor = ({ questions, setQuestions }) => {
  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]);
  };

  const updateQuestion = (idx, data) => {
    const newQ = [...questions];
    newQ[idx] = { ...newQ[idx], ...data };
    setQuestions(newQ);
  };

  const removeQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8">
      {questions.map((q, qIdx) => (
        <div key={qIdx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Question {qIdx + 1}</label>
              <textarea className="input min-h-[80px]" placeholder="What is the main topic of this lesson?" value={q.question} onChange={(e) => updateQuestion(qIdx, { question: e.target.value })} />
            </div>
            <button onClick={() => removeQuestion(qIdx)} className="text-slate-400 hover:text-rose-500 transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center gap-3">
                <input type="radio" checked={q.correctAnswer === oIdx} onChange={() => updateQuestion(qIdx, { correctAnswer: oIdx })} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <Input placeholder={`Option ${oIdx + 1}`} value={opt} onChange={(e) => {
                  const newOpt = [...q.options];
                  newOpt[oIdx] = e.target.value;
                  updateQuestion(qIdx, { options: newOpt });
                }} />
              </div>
            ))}
          </div>
          <textarea className="input text-sm" placeholder="Explain why this is the correct answer..." value={q.explanation} onChange={(e) => updateQuestion(qIdx, { explanation: e.target.value })} />
        </div>
      ))}
      <button onClick={addQuestion} className="w-full py-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-800/50">
        <PlusCircle className="w-5 h-5" /> Add MCQ Question
      </button>
    </div>
  );
};

export default CreateCourse;
