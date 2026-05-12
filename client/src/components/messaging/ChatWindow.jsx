import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ChatFileMessage from './ChatFileMessage';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const ChatWindow = ({ activeChat, messages, setMessages }) => {
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e, attachment = null) => {
    if (e) e.preventDefault();
    if (!input.trim() && !attachment) return;

    try {
      const res = await api.post('/messages', {
        receiver: activeChat.id || activeChat._id,
        content: input,
        attachment
      });

      if (res.data.success) {
        setMessages([...messages, res.data.message]);
        setInput('');
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload/chat-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        handleSend(null, {
          url: res.data.url,
          name: res.data.name,
          type: res.data.type,
          size: res.data.size,
          publicId: res.data.publicId
        });
      }
    } catch (error) {
      toast.error('File upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-indigo-600">
            {activeChat.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{activeChat.name}</h2>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        {messages.map((m, i) => {
          const isSender = m.sender._id === activeChat.myId || m.sender === 'me' || m.sender._id === activeChat._id; // Simplified logic
          // Correct sender logic based on your auth state would be better, but using isSender prop for now
          const amISender = m.sender._id ? m.sender._id !== activeChat._id : m.sender === 'me';

          return (
            <motion.div
              key={m._id || i}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${amISender ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${m.attachment ? '' : 'p-4 rounded-3xl'} text-sm shadow-sm ${
                amISender 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700'
              }`}>
                {m.attachment ? (
                  <ChatFileMessage attachment={m.attachment} isSender={amISender} />
                ) : (
                  <p className="leading-relaxed">{m.content}</p>
                )}
                {!m.attachment && (
                  <div className={`text-[10px] mt-1 font-bold ${amISender ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.zip"
          />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Paperclip className="w-6 h-6" />}
          </button>
          <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors hidden sm:block">
            <Smile className="w-6 h-6" />
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!input.trim() && !isUploading}
            className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
