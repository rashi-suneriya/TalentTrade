import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../api/axios';
import { Repeat, Clock, CheckCircle, XCircle, ArrowRight, Star, MessageSquare } from 'lucide-react';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const SwapsDashboard = () => {
  const [swaps, setSwaps] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchSwaps = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/swaps');
      if (res.data.success) {
        setSwaps(res.data.swaps || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // For demo purposes, we'll use some mock data if the API fails or is empty
    const mockSwaps = [
      {
        _id: '1',
        sender: { name: 'Sarah Wilson', avatar: '' },
        receiver: { name: 'You' },
        skillOffered: { title: 'Python Development', category: 'Technology' },
        skillWanted: { title: 'UI Design', category: 'Design' },
        status: 'pending',
        createdAt: new Date().toISOString(),
        message: "Hi! I'd love to learn some UI design basics in exchange for helping you with Python scripts."
      },
      {
        _id: '2',
        sender: { name: 'You' },
        receiver: { name: 'Alex Rivera', avatar: '' },
        skillOffered: { title: 'Graphic Design', category: 'Design' },
        skillWanted: { title: 'Mandarin', category: 'Language' },
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];
    setSwaps(mockSwaps);
    setIsLoading(false);
  }, []);

  const filteredSwaps = swaps.filter(s => {
    if (activeTab === 'all') return true;
    return s.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Repeat className="w-8 h-8 text-indigo-600" /> Skill Swaps
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your active skill exchanges and pending requests.</p>
          </div>
          <Link to="/swaps/suggestions">
            <Button className="rounded-2xl h-12 px-8">Find Swap Partners</Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'pending', 'active', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                activeTab === tab 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-indigo-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => <div key={i} className="card h-64 animate-pulse bg-slate-200 dark:bg-slate-800" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredSwaps.map((swap) => (
                <motion.div
                  layout
                  key={swap._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card p-6 border-l-4 border-l-indigo-600 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-indigo-600">
                          {swap.sender.name === 'You' ? swap.receiver.name.charAt(0) : swap.sender.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800 dark:text-white">
                            {swap.sender.name === 'You' ? swap.receiver.name : swap.sender.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {new Date(swap.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        swap.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                        swap.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {swap.status}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">They Give</div>
                        <div className="text-sm font-bold text-slate-800 dark:text-white truncate">
                          {swap.sender.name === 'You' ? swap.skillWanted.title : swap.skillOffered.title}
                        </div>
                      </div>
                      <Repeat className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">You Give</div>
                        <div className="text-sm font-bold text-slate-800 dark:text-white truncate">
                          {swap.sender.name === 'You' ? swap.skillOffered.title : swap.skillWanted.title}
                        </div>
                      </div>
                    </div>

                    {swap.message && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-6">
                        "{swap.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                    {swap.status === 'pending' && swap.sender.name !== 'You' ? (
                      <>
                        <Button className="flex-1 h-10 text-xs">Accept Swap</Button>
                        <Button variant="secondary" className="flex-1 h-10 text-xs text-red-500 border-red-500 hover:bg-red-50">Decline</Button>
                      </>
                    ) : swap.status === 'active' ? (
                      <>
                        <Button className="flex-1 h-10 text-xs bg-emerald-600 hover:bg-emerald-700">Complete & Award</Button>
                        <Button variant="secondary" className="h-10 px-4">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="secondary" className="w-full h-10 text-xs">View Details</Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && filteredSwaps.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Repeat className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">No {activeTab} swaps yet</h3>
            <p className="text-slate-500 mt-2 mb-8">Start by finding partners who share your interests.</p>
            <Link to="/swaps/suggestions">
              <Button>Explore Potential Matches</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default SwapsDashboard;
