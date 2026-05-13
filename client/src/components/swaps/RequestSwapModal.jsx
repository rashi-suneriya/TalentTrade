import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { ArrowRight, MessageSquare, Repeat } from 'lucide-react';

const RequestSwapModal = ({ isOpen, onClose, receiver }) => {
  const { user: currentUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [selectedSkillOffered, setSelectedSkillOffered] = useState('');
  const [selectedSkillWanted, setSelectedSkillWanted] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkillOffered || !selectedSkillWanted) {
      return toast.error('Please select both skills');
    }

    setLoading(true);
    try {
      const skillOffered = currentUser.skillsOffered.find(s => s.title === selectedSkillOffered);
      const skillWanted = receiver.skillsOffered.find(s => s.title === selectedSkillWanted);

      const res = await api.post('/swaps', {
        receiver: receiver._id || receiver.id,
        skillOffered,
        skillWanted,
        message
      });

      if (res.data.success) {
        toast.success('Swap request sent successfully!');
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Propose Skill Swap">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step-like UI */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-indigo-500 block mb-2">You Offer</label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              value={selectedSkillOffered}
              onChange={(e) => setSelectedSkillOffered(e.target.value)}
              required
            >
              <option value="">Select your skill...</option>
              {currentUser?.skillsOffered?.length > 0 ? (
                currentUser.skillsOffered.map((skill, i) => (
                  <option key={i} value={skill.title}>{skill.title}</option>
                ))
              ) : (
                <option disabled>No skills added to your profile</option>
              )}
            </select>
            {currentUser?.skillsOffered?.length === 0 && (
              <p className="text-[10px] text-rose-500 mt-1 font-bold">Please add skills to your profile first.</p>
            )}
          </div>

          <div className="flex justify-center">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600">
              <Repeat className="w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-emerald-500 block mb-2">You Want from {receiver?.name}</label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              value={selectedSkillWanted}
              onChange={(e) => setSelectedSkillWanted(e.target.value)}
              required
            >
              <option value="">Select their skill...</option>
              {receiver?.skillsOffered?.length > 0 ? (
                receiver.skillsOffered.map((skill, i) => (
                  <option key={i} value={skill.title}>{skill.title}</option>
                ))
              ) : (
                <option disabled>This user hasn't listed any skills yet</option>
              )}
            </select>
            {receiver?.skillsOffered?.length === 0 && (
              <p className="text-[10px] text-rose-500 mt-1 font-bold">This user has no skills available for swap.</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Personal Message (Optional)</label>
          <textarea
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            placeholder="Introduce yourself and explain why you want to swap..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1 h-14 rounded-2xl font-black">
            Cancel
          </Button>
          <Button isLoading={loading} type="submit" disabled={!currentUser?.skillsOffered?.length || !receiver?.skillsOffered?.length} className="flex-1 h-14 rounded-2xl font-black shadow-xl shadow-indigo-500/20">
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestSwapModal;
