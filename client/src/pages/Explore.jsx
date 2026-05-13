import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../api/axios';
import { Search, Filter, Star, Clock, User, ChevronDown, BookOpen } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Explore = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    level: ''
  });

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/courses', { params: { search, ...filters } });
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchCourses, 500);
    return () => clearTimeout(timer);
  }, [search, filters]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Explore Skills</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Discover courses taught by real experts in the community.</p>
          </div>
          
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search skills, courses, or teachers..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="card">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white mb-6">
                <Filter className="w-4 h-4" /> Filters
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Category</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-sm outline-none"
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Design">Design</option>
                    <option value="Music">Music</option>
                    <option value="Language">Language</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Level</label>
                  <div className="space-y-2">
                    {['beginner', 'intermediate', 'advanced'].map(lvl => (
                      <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.level === lvl}
                          onChange={() => setFilters({ ...filters, level: filters.level === lvl ? '' : lvl })}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400 capitalize group-hover:text-indigo-600 transition-colors">
                          {lvl}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full text-xs font-bold text-slate-500"
                  onClick={() => setFilters({ category: '', level: '' })}
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="card bg-indigo-600 text-white border-none text-center">
              <h3 className="font-bold mb-2">Want to Teach?</h3>
              <p className="text-xs text-indigo-100 mb-4">Share your knowledge and earn SkillTokens.</p>
              <Button className="w-full bg-white text-indigo-600 h-9 text-xs" onClick={() => navigate('/become-teacher')}>Create Course</Button>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-800 dark:text-white">{courses.length}</span> results
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                Sort by: <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1 cursor-pointer">Latest <ChevronDown className="w-4 h-4" /></span>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="card h-80 animate-pulse bg-slate-200 dark:bg-slate-800" />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {courses.map((course, i) => (
                    <motion.div
                      layout
                      key={course._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(`/learn/${course._id}`)}
                      className="card p-0 overflow-hidden group cursor-pointer border-transparent hover:border-indigo-500 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-slate-300" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
                          {course.category}
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
                            {course.teacher.avatar ? (
                              <img src={course.teacher.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>
                          <span className="text-xs font-medium text-slate-500">{course.teacher.name}</span>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 dark:text-white mb-3 line-clamp-2 leading-snug">
                          {course.title}
                        </h3>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-current" /> {course.averageRating || '5.0'}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                              <User className="w-3.5 h-3.5" /> {course.enrolledCount}
                            </div>
                          </div>
                          <div className="text-sm font-bold text-indigo-600">
                            {course.price === 0 ? 'Free' : `${course.price} Tokens`}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {!isLoading && courses.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">No courses found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters or search keywords.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;
