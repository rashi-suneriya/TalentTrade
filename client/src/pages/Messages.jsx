import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import api from '../api/axios';
import { 
  Search, Send, User, MoreVertical, Phone, Video, 
  Smile, MessageSquare, Plus, Pencil, ChevronLeft 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from '../components/messaging/ChatWindow';
import { formatDate } from '../utils/formatDate';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchConversations = async () => {
    try {
      const res = await api.get('/users/me/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const res = await api.get(`/messages/${activeChat.user._id}`);
          if (res.data.success) {
            setMessages(res.data.messages);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchMessages();
    }
  }, [activeChat]);

  const filteredConversations = conversations.filter(c => 
    c.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pb-20 md:pb-0 overflow-hidden">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-0 md:p-6 flex gap-6 overflow-hidden">
        {/* Sidebar: Conversation List */}
        <aside className={`w-full md:w-80 lg:w-[400px] bg-white dark:bg-slate-900 md:rounded-[32px] border-r md:border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm transition-all duration-300 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 md:p-8 space-y-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Conversations</h1>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-20 md:pb-4">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
              </div>
            ) : filteredConversations.length > 0 ? (
              <div className="space-y-1">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.user._id}
                    onClick={() => setActiveChat(conv)}
                    className={`w-full p-4 flex items-center gap-4 rounded-2xl transition-all ${
                      activeChat?.user._id === conv.user._id 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center font-bold ${activeChat?.user._id === conv.user._id ? 'text-white' : 'text-indigo-600'}`}>
                        {conv.user.avatar ? <img src={conv.user.avatar} className="w-full h-full object-cover" /> : conv.user.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-black truncate">{conv.user.name}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${activeChat?.user._id === conv.user._id ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {formatTime(conv.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs truncate font-medium ${
                          activeChat?.user._id === conv.user._id ? 'text-indigo-50' : conv.unreadCount > 0 ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500'
                        }`}>
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && activeChat?.user._id !== conv.user._id && (
                          <span className="flex-shrink-0 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-sm font-bold text-slate-400">No conversations yet</p>
                <button className="mt-4 text-indigo-600 text-sm font-black uppercase tracking-widest">Start Chatting</button>
              </div>
            )}
          </div>

          {/* Floating Compose Button */}
          <button className="absolute bottom-24 md:bottom-10 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-40 md:hidden">
            <Pencil className="w-6 h-6" />
          </button>
        </aside>

        {/* Chat Window Container */}
        <section className={`flex-1 bg-white dark:bg-slate-900 md:rounded-[32px] md:border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm overflow-hidden transition-all duration-300 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <div className="flex-1 flex flex-col h-full">
               {/* Mobile Header */}
               <div className="md:hidden flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800">
                  <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-slate-50 rounded-full">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-600">
                      {activeChat.user.avatar ? <img src={activeChat.user.avatar} className="w-full h-full object-cover" /> : activeChat.user.name.charAt(0)}
                    </div>
                    <span className="font-black text-slate-900 dark:text-white">{activeChat.user.name}</span>
                  </div>
               </div>
               <div className="flex-1 overflow-hidden">
                <ChatWindow 
                  activeChat={{ id: activeChat.user._id, ...activeChat.user }} 
                  messages={messages} 
                  setMessages={setMessages} 
                />
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-8">
                <MessageSquare className="w-16 h-16 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Your Conversations</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm font-medium leading-relaxed">
                Connect with mentors and learners across the community. Select a chat to continue your skill exchange journey.
              </p>
              <button className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 hover:scale-105 transition-transform active:scale-95">
                Start New Chat
              </button>
            </div>
          )}
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

export default Messages;
