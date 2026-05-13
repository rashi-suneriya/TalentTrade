import { Link, useLocation } from 'react-router-dom';
import { Home, Repeat, MessageSquare, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';

const BottomNav = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuthStore();
  const { unreadCount } = useNotificationStore(); // Assuming unreadCount also includes messages or we can fetch it

  if (!isLoggedIn) return null;

  const navItems = [
    { path: '/dashboard', icon: <Home className="w-6 h-6" />, label: 'Home' },
    { path: '/swaps', icon: <Repeat className="w-6 h-6" />, label: 'Swaps' },
    { path: '/messages', icon: <MessageSquare className="w-6 h-6" />, label: 'Chats', badge: unreadCount > 0 ? unreadCount : null },
    { path: '/profile', icon: <User className="w-6 h-6" />, label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full relative transition-all ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
