import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import api from '../api/axios';
import { Search, Send, User, MoreVertical, Phone, Video, Smile, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from '../components/messaging/ChatWindow';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations');
        if (res.data.success) {
          setConversations(res.data.conversations.map(c => ({
            id: c.user._id,
            name: c.user.name,
            lastMessage: c.lastMessage,
            time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: c.user.avatar,
            unread: c.unreadCount
          })));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const res = await api.get(`/messages/${activeChat.id}`);
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

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 flex gap-4 overflow-hidden">
        {/* Sidebar: Conversation List */}
        <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveChat(conv)}
                className={`w-full p-4 flex items-center gap-4 transition-all border-b border-slate-50 dark:border-slate-800/50 ${
                  activeChat?.id === conv.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center font-bold text-indigo-600">
                    {conv.avatar ? <img src={conv.avatar} className="w-full h-full object-cover" /> : conv.name.charAt(0)}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-white truncate">{conv.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate ${conv.unread > 0 ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Window */}
        <section className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm overflow-hidden">
          {activeChat ? (
            <ChatWindow 
              activeChat={activeChat} 
              messages={messages} 
              setMessages={setMessages} 
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Your Conversations</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                Select a message from the list to start chatting with your skill swap partners.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
export default Messages;
