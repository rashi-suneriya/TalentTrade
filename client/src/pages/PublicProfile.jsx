import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { 
  Star, Calendar, MapPin, Clock, MessageSquare, Repeat, 
  ChevronLeft, Award, Globe, BookOpen, ShieldCheck 
} from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import RequestSwapModal from '../components/swaps/RequestSwapModal';

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  const isOwnProfile = currentUser?.id === id || currentUser?._id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${id}/public`);
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-slate-900 rounded-[32px] text-center shadow-xl">
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <Button onClick={() => navigate('/explore/skills')}>Back to Explore</Button>
      </div>
    </div>
  );

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 md:pb-0">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Top Section: Avatar & Basic Info */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-5xl font-black">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
              <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 dark:text-slate-400 font-bold text-sm">
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full text-amber-600">
                  <Star className="w-4 h-4 fill-current" /> {user.averageRating?.toFixed(1)} ({user.totalRatings} reviews)
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4" /> Member since {joinDate}
                </div>
                <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-full text-indigo-600">
                  <BookOpen className="w-4 h-4" /> {user.skillsOffered?.length || 0} skills
                </div>
              </div>
            </div>
          </div>

          {/* Skill Offering Title & Category */}
          <div className="card text-center p-8 bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-none shadow-indigo-500/20">
            <h2 className="text-2xl md:text-3xl font-black mb-3">
              {user.skillsOffered?.[0]?.title || 'Skilled Professional'}
            </h2>
            <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest">
              {user.skillsOffered?.[0]?.category || 'General'}
            </span>
          </div>

          {/* Bio Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">About Me</h3>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                  {user.bio || "No bio added yet. This user is passionate about sharing knowledge and growing through collaboration."}
                </p>
              </div>

              {/* Skills Wanted */}
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">Looking For</h3>
                <div className="flex flex-wrap gap-3 font-bold">
                  {user.skillsWanted?.map((s, i) => (
                    <span key={i} className="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                      {s.title || s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">Details</h3>
              <div className="card space-y-6 p-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Session Length</div>
                    <div className="font-bold text-slate-700 dark:text-slate-200">60 mins / session</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-emerald-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</div>
                    <div className="font-bold text-slate-700 dark:text-slate-200">Remote Only</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-amber-500">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Availability</div>
                    <div className="font-bold text-slate-700 dark:text-slate-200">Weekends</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-4 md:static pt-10">
            {isOwnProfile ? (
              <Button 
                className="w-full h-16 rounded-[24px] text-lg font-black shadow-2xl shadow-indigo-500/30"
                onClick={() => navigate('/profile')}
              >
                Edit My Profile
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="secondary" 
                  className="h-16 rounded-[24px] text-lg font-black bg-white dark:bg-slate-900"
                  onClick={() => navigate('/messages')}
                >
                  <MessageSquare className="w-5 h-5 mr-2" /> Message
                </Button>
                <Button 
                  className="h-16 rounded-[24px] text-lg font-black shadow-2xl shadow-indigo-500/30"
                  onClick={() => setIsSwapModalOpen(true)}
                >
                  <Repeat className="w-5 h-5 mr-2" /> Request Swap
                </Button>
              </div>
            )}
          </div>

          {/* Reviews Section Preview */}
          <div className="pt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">Recent Reviews</h3>
              <button className="text-sm font-black text-indigo-600">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {user.reviews?.slice(0, 2).map((review, i) => (
                <div key={i} className="card p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                   <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                        {review.reviewer?.avatar ? (
                          <img src={review.reviewer.avatar} alt={review.reviewer?.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-slate-400 font-bold">{review.reviewer?.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{review.reviewer?.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Verified Learner</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3 h-3 fill-current" /> {review.rating}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{review.comment}"</p>
                </div>
              ))}
              {(!user.reviews || user.reviews.length === 0) && (
                <div className="col-span-full py-10 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
                  No reviews yet. Be the first to swap and leave a review!
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
      <BottomNav />

      {user && (
        <RequestSwapModal 
          isOpen={isSwapModalOpen} 
          onClose={() => setIsSwapModalOpen(false)} 
          receiver={user} 
        />
      )}
    </div>
  );
};

export default PublicProfile;
