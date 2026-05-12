import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../api/axios';
import { 
  Users, 
  BookOpen, 
  Eye, 
  TrendingUp, 
  Plus, 
  Edit, 
  Play, 
  MoreVertical,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalViews: 0,
    completionRate: 0
  });

  const enrollmentData = [
    { name: 'Day 1', students: 400 },
    { name: 'Day 5', students: 600 },
    { name: 'Day 10', students: 800 },
    { name: 'Day 15', students: 1200 },
    { name: 'Day 20', students: 1500 },
    { name: 'Day 25', students: 1800 },
    { name: 'Day 30', students: 2400 },
  ];

  const courseStatsData = [
    { name: 'React', students: 45 },
    { name: 'Node.js', students: 32 },
    { name: 'UI Design', students: 28 },
    { name: 'English', students: 15 },
  ];

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/courses/teacher/my-courses');
        if (res.data.success) {
          setCourses(res.data.courses);
          // Set mock stats for now if backend doesn't have aggregate stats yet
          setStats({
            totalCourses: res.data.courses.length,
            totalStudents: res.data.courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0),
            totalViews: res.data.courses.reduce((acc, c) => acc + (c.viewCount || 0), 1250),
            completionRate: 78
          });
        }
      } catch (error) {
        console.error('Dashboard fetch failed', error);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Teacher Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Track your growth and manage your educational content.</p>
          </div>
          <Link to="/teach/create-course">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              <Plus className="w-5 h-5" /> Create New Course
            </button>
          </Link>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Courses', value: stats.totalCourses, icon: <BookOpen />, color: 'bg-indigo-500' },
            { label: 'Total Students', value: stats.totalStudents, icon: <Users />, color: 'bg-emerald-500' },
            { label: 'Total Views', value: stats.totalViews, icon: <Eye />, color: 'bg-amber-500' },
            { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: <TrendingUp />, color: 'bg-rose-500' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-lg shadow-current/20`}>
                  {item.icon}
                </div>
                <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                  <ArrowUpRight className="w-3 h-3" /> 12%
                </div>
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{item.label}</div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{item.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Enrollment Trend (30 Days)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: '#1e293b',
                      color: '#fff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="students" 
                    stroke="#4f46e5" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#4f46e5' }} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Students per Course</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseStatsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="students" radius={[10, 10, 0, 0]}>
                    {courseStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#8b5cf6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Active Courses</h3>
            <button className="text-sm font-bold text-indigo-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-50 dark:border-slate-800/50">
                  <th className="px-8 py-4">Course</th>
                  <th className="px-8 py-4">Students</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, idx) => (
                  <tr key={course._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all border-b border-slate-50 dark:border-slate-800/50 last:border-none">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={course.thumbnail} className="w-16 h-10 object-cover rounded-lg shadow-sm" alt="" />
                        <div className="max-w-[200px]">
                          <div className="text-sm font-bold text-slate-800 dark:text-white truncate">{course.title}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{course.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-600 dark:text-slate-400">
                      {course.enrolledCount || 0}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        course.isPublished 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/teach/edit-course/${course._id}`}>
                          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link to={`/learn/${course._id}`}>
                          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-600 transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
