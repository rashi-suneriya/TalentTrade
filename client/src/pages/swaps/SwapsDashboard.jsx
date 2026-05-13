import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import BottomNav from '../../components/layout/BottomNav';
import api from '../../api/axios';
import { 
  Repeat, ArrowRight, ArrowLeftRight, Clock, 
  CheckCircle, AlertCircle, Plus, ChevronRight,
  MessageSquare
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../utils/formatDate';

const SwapsDashboard = () => {
  const [swaps, setSwaps] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
    fetchSwaps();
  }, []);

  const filteredSwaps = swaps.filter(s => {
    if (activeTab === 'active') return s.status === 'active' || s.status === 'accepted';
    if (activeTab === 'pending') return s.status === 'pending';
    if (activeTab === 'completed') return s.status === 'completed' || s.status === 'finished';
    return true;
  });

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (['accepted', 'active'].includes(s)) 
      return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-full tracking-widest">Accepted</span>;
    if (s === 'pending') 
      return <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded-full tracking-widest">Pending</span>;
    return <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-full tracking-widest">Completed</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 md:pb-0">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Skill Swaps</h1>
            
            {/* Tab Pills */}
            <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              {['active', 'pending', 'completed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => <div key={i} className="card h-40 animate-pulse bg-slate-200 dark:bg-slate-800" />)}
            </div>
          ) : filteredSwaps.length > 0 ? (
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredSwaps.map((swap) => (
                  <SwapCard key={swap._id} swap={swap} badge={getStatusBadge(swap.status)} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Repeat className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">No {activeTab} swaps</h3>
              <p className="text-slate-500 mt-2 font-medium">Time to explore new skills and start a collaboration!</p>
              <Button 
                className="mt-10 h-14 px-10 rounded-2xl font-black text-sm"
                onClick={() => navigate('/explore/skills')}
              >
                Find Learning Partners
              </Button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/explore/skills')}
        className="fixed bottom-24 md:bottom-10 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-40"
      >
        <Plus className="w-8 h-8" />
      </button>

      <BottomNav />
    </div>
  );
};

const SwapCard = ({ swap, badge }) => {
  const navigate = useNavigate();
  const date = formatDate(swap.createdAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card group hover:border-indigo-500/50 transition-all duration-300"
    >
      <div className="p-6 md:p-8 space-y-8">
        <div className="flex items-start justify-between">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-8 md:gap-12">
            
            {/* Side A: You offered */}
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500">You offered</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">{swap.skillOffered.title}</div>
              <div className="text-sm font-bold text-slate-400">with {swap.receiver.name}</div>
            </div>

            {/* Center Icon */}
            <div className="hidden md:flex w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-full items-center justify-center text-indigo-600">
              <ArrowLeftRight className="w-6 h-6" />
            </div>

            {/* Side B: Received */}
            <div className="space-y-1 md:text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">You Receive</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">{swap.skillWanted.title}</div>
              <div className="text-sm font-bold text-slate-400">from {swap.receiver.name}</div>
            </div>
          </div>

          <div className="ml-4">{badge}</div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <Clock className="w-4 h-4" /> Created {date}
          </div>
          <div className="flex items-center gap-3">
             <Button 
              variant="secondary"
              className="w-10 h-10 p-0 rounded-xl"
              onClick={() => navigate('/messages')}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button 
              variant="secondary" 
              className="rounded-xl px-6 h-10 text-xs font-black uppercase tracking-widest"
              onClick={() => navigate(`/swaps/${swap._id}`)}
            >
              View Details <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SwapsDashboard;
