import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import api from '../api/axios';
import { Search, Star, User, MessageSquare, Repeat, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';

const CATEGORIES = ["All", "Design", "Music", "Programming", "Language", "Cooking", "Photography"];

const ExploreSkills = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = {
        query: debouncedSearch,
        category: selectedCategory === 'All' ? '' : selectedCategory,
        page,
        limit: 12
      };
      const res = await api.get('/users', { params });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, selectedCategory, page]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 md:pb-0">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Discover Skills</h1>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search skills or users..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all text-slate-700 dark:text-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setPage(1); }}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="card h-[280px] animate-pulse bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {users.map((user, i) => (
                  <UserCard key={user._id || user.id} user={user} index={i} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">No results found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your search or category filter.</p>
            </div>
          )}

          {/* Pagination Placeholder */}
          {!isLoading && users.length > 0 && (
            <div className="flex justify-center items-center gap-4 pt-10">
              <Button 
                variant="secondary" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <span className="text-sm font-bold text-slate-500">Page {page}</span>
              <Button 
                variant="secondary"
                disabled={users.length < 12}
                onClick={() => setPage(p => p + 1)}
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
};

const UserCard = ({ user, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/profile/${user._id}`)}
      className="card p-6 flex flex-col group cursor-pointer border-transparent hover:border-indigo-500 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white">{user.name}</h4>
            <div className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider inline-block">
              {user.skillsOffered?.[0]?.category || 'Member'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 fill-current" /> {user.averageRating?.toFixed(1) || '5.0'}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug mb-2 line-clamp-1">
          {user.skillsOffered?.[0]?.title || 'Available to Swap'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {user.bio || 'Passionate about sharing knowledge and learning new skills.'}
        </p>

        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Looking for:</div>
          <div className="flex flex-wrap gap-1.5">
            {user.skillsWanted?.slice(0, 3).map((s, i) => (
              <span key={i} className="px-2 py-1 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-lg border border-slate-100 dark:border-slate-800">
                {s.title || s}
              </span>
            ))}
            {user.skillsWanted?.length > 3 && (
              <span className="text-[10px] font-bold text-slate-400">+{user.skillsWanted.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          className="h-9 px-4 text-xs" 
          onClick={(e) => {
            e.stopPropagation();
            // Handle Propose Swap - for now navigate to profile or existing modal if available
            navigate(`/profile/${user._id}`);
          }}
        >
          Propose Swap
        </Button>
      </div>
    </motion.div>
  );
};

export default ExploreSkills;
