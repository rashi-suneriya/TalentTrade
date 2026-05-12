import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/layout/Navbar';
import { Book, Repeat, Award, ArrowUpRight, Clock, Star } from 'lucide-react';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Enrolled', value: '4', icon: <Book className="w-5 h-5 text-blue-500" /> },
    { label: 'Swaps', value: '2', icon: <Repeat className="w-5 h-5 text-amber-500" /> },
    { label: 'Tokens', value: user?.tokens || '100', icon: <Award className="w-5 h-5 text-indigo-500" /> },
    { label: 'Avg Rating', value: '5.0', icon: <Star className="w-5 h-5 text-yellow-500" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Welcome Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              You have 2 active swaps and 1 course to complete today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary">My Learnings</Button>
            <Button>Explore More</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Continue Learning</h2>
              <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline">
                View all <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Advanced React Patterns', teacher: 'Sarah Drasner', progress: 65, color: 'bg-blue-500' },
                { title: 'Graphic Design Fundamentals', teacher: 'Gary Simon', progress: 30, color: 'bg-purple-500' }
              ].map((course, i) => (
                <div key={i} className="card p-4 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors cursor-pointer group">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-xl mb-4 overflow-hidden relative">
                    <div className={`absolute bottom-0 left-0 h-1 ${course.color}`} style={{ width: `${course.progress}%` }} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{course.teacher}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-600">{course.progress}% Complete</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2h left
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Swaps */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Active Swaps</h2>
                <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline">
                  Go to Dashboard <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Alex Rivera', offer: 'UI Design', want: 'Python', status: 'In Progress' },
                  { name: 'Elena Chen', offer: 'Mandarin', want: 'Guitar', status: 'Pending Approval' }
                ].map((swap, i) => (
                  <div key={i} className="card flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                      <div>
                        <div className="font-bold text-slate-800 dark:text-white">{swap.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {swap.offer} <span className="text-indigo-600 font-bold mx-1">↔</span> {swap.want}
                        </div>
                      </div>
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full font-bold ${
                      swap.status === 'In Progress' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {swap.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Suggested for you */}
            <div className="card bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-none p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Need a Match?</h3>
                <p className="text-indigo-100 text-sm mb-4">Our AI found 3 new partners that match your skills wanted.</p>
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none h-10 text-sm">
                  Find Partners
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl -mr-16 -mt-16" />
            </div>

            {/* Recent Notifications */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Alerts</h2>
              <div className="space-y-4">
                {[
                  { title: 'New Swap Proposal', time: '2h ago', body: 'Sarah wants to learn Figma from you.' },
                  { title: 'Token Awarded', time: '5h ago', body: 'You earned 50 tokens for completing a course.' }
                ].map((n, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                    <div>
                      <div className="font-bold text-sm text-slate-800 dark:text-white flex items-center justify-between">
                        {n.title} <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
