import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Bell, MessageSquare, LogOut, GraduationCap, LayoutDashboard } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 hidden sm:block">
              TalentTrade
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link to="/explore" className="hover:text-indigo-600 transition-colors">Explore Courses</Link>
            <Link to="/explore/skills" className="hover:text-indigo-600 transition-colors">Discover Skills</Link>
            <Link to="/swaps" className="hover:text-indigo-600 transition-colors">Swaps</Link>
            {isLoggedIn && user?.role === 'teacher' && (
              <Link to="/teach/create-course" className="hover:text-indigo-600 transition-colors">Create Course</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Role-based button */}
              <div className="hidden lg:block">
                {user?.role === 'teacher' ? (
                  <Link to="/teach/dashboard">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-all">
                      <LayoutDashboard className="w-4 h-4" />
                      Teacher Dashboard
                    </button>
                  </Link>
                ) : (
                  <Link to="/become-teacher">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-100 transition-all">
                      <GraduationCap className="w-4 h-4" />
                      Become a Teacher
                    </button>
                  </Link>
                )}
              </div>

              <Link to="/messages" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
                <MessageSquare className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </Link>

              <Link to="/notifications" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link to="/profile" className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-slate-700 overflow-hidden ring-2 ring-indigo-100 dark:ring-slate-700">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 hidden xl:block">
                  {user?.tokens} <span className="text-indigo-500">Tokens</span>
                </span>
              </Link>

              <button 
                onClick={logout}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                Log in
              </Link>
              <Link to="/register">
                <Button className="h-10 px-6">Join Now</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
