import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import { useAuthStore } from '../store/authStore';
import { 
  Edit3, MapPin, Globe, Award, Star, BookOpen, 
  Repeat, X, Save, Plus, Share2, LogOut, ShieldCheck 
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, logout } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const profileUser = {
    ...user,
    bio: user?.bio || "No bio added yet. Tell us about yourself!",
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    socialLinks: user?.socialLinks || {
      github: '',
      linkedin: '',
      website: ''
    },
    tokens: user?.tokens || 0
  };

  const handleShare = async () => {
    const shareData = {
      title: `${profileUser.name} - TalentTrade`,
      text: `Check out ${profileUser.name}'s profile on TalentTrade!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') toast.error('Could not share profile');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Profile link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 md:pb-0">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Top Section */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[48px] bg-indigo-100 dark:bg-indigo-900/30 overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                {profileUser.avatar ? (
                  <img src={profileUser.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black text-indigo-600">
                    {profileUser.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-2xl shadow-lg border-2 border-white dark:border-slate-900">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{profileUser.name}</h1>
              <div className="flex items-center justify-center gap-2 text-slate-500 font-bold text-sm">
                <MapPin className="w-4 h-4 text-indigo-500" /> New York, USA
              </div>
              <div className="flex items-center justify-center gap-4 text-amber-500 font-bold text-sm bg-amber-50 dark:bg-amber-900/20 px-4 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-current" /> {user?.averageRating?.toFixed(1) || '5.0'} ({user?.totalRatings || 0} reviews)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <Button onClick={() => setIsEditModalOpen(true)} className="h-14 rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20">
                Edit Profile
              </Button>
              <Button variant="secondary" onClick={logout} className="h-14 rounded-2xl font-black text-sm text-slate-500 border-slate-200">
                <LogOut className="w-4 h-4 mr-2" /> Log Out
              </Button>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">About Me</h3>
            <div className="card p-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {profileUser.bio}
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">My Skills</h3>
              <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6 space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500">I'm Teaching</div>
                <div className="flex flex-wrap gap-2">
                  {profileUser.skillsOffered.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                      {skill.title}
                    </span>
                  ))}
                </div>
              </div>
              <div className="card p-6 space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-500">I'm Learning</div>
                <div className="flex flex-wrap gap-2">
                  {profileUser.skillsWanted.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl text-xs font-black uppercase tracking-widest border border-amber-100 dark:border-amber-800">
                      {skill.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">Recent Reviews</h3>
              <button className="text-xs font-black text-indigo-600 uppercase tracking-widest">View All</button>
            </div>
            
            <div className="space-y-4">
              {(!user?.reviews || user.reviews.length === 0) ? (
                <div className="p-12 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[40px]">
                  No reviews yet. Complete a swap to start building your reputation!
                </div>
              ) : (
                user.reviews.slice(0, 3).map((review, i) => (
                  <div key={i} className="card p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {review.reviewer?.avatar ? (
                        <img src={review.reviewer.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-400 font-bold">{review.reviewer?.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{review.reviewer?.name}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                          <Star className="w-3 h-3 fill-current" /> {review.rating}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal 
            user={user} 
            onClose={() => setIsEditModalOpen(false)} 
            onSave={updateProfile}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    socialLinks: {
      github: user?.socialLinks?.github || '',
      linkedin: user?.socialLinks?.linkedin || '',
      website: user?.socialLinks?.website || ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState({ teaching: '', learning: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = (type) => {
    const val = skillInput[type].trim();
    if (!val) return;
    
    if (type === 'teaching') {
      const skills = Array.isArray(formData.skillsOffered) ? formData.skillsOffered : [];
      if (!skills.find(s => (s?.title || s)?.toString().toLowerCase() === val.toLowerCase())) {
        setFormData({
          ...formData,
          skillsOffered: [...skills, { title: val, level: 'intermediate', category: 'General' }]
        });
      }
    } else {
      const skills = Array.isArray(formData.skillsWanted) ? formData.skillsWanted : [];
      if (!skills.find(s => (s?.title || s)?.toString().toLowerCase() === val.toLowerCase())) {
        setFormData({
          ...formData,
          skillsWanted: [...skills, { title: val, category: 'General' }]
        });
      }
    }
    setSkillInput({ ...skillInput, [type]: '' });
  };

  const handleRemoveSkill = (type, title) => {
    if (type === 'teaching') {
      setFormData({
        ...formData,
        skillsOffered: formData.skillsOffered.filter(s => s.title !== title)
      });
    } else {
      setFormData({
        ...formData,
        skillsWanted: formData.skillsWanted.filter(s => s.title !== title)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await onSave(formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success('Profile updated successfully!');
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Avatar URL" name="avatar" value={formData.avatar} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">About Me</label>
            <textarea 
              name="bio"
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 min-h-[120px] outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 dark:text-slate-200"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Share your passion..."
              maxLength={300}
            />
            <div className="text-[10px] text-right text-slate-400 font-bold uppercase">{formData.bio.length}/300</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-indigo-500">I'm Teaching</label>
              <div className="flex gap-2">
                <Input placeholder="Add skill..." value={skillInput.teaching} onChange={(e) => setSkillInput({...skillInput, teaching: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('teaching'))} />
                <Button type="button" variant="secondary" onClick={() => handleAddSkill('teaching')} className="w-12 p-0"><Plus className="w-5 h-5" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skillsOffered.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                    {skill.title}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveSkill('teaching', skill.title)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-amber-500">I'm Learning</label>
              <div className="flex gap-2">
                <Input placeholder="Add skill..." value={skillInput.learning} onChange={(e) => setSkillInput({...skillInput, learning: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('learning'))} />
                <Button type="button" variant="secondary" onClick={() => handleAddSkill('learning')} className="w-12 p-0"><Plus className="w-5 h-5" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skillsWanted.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                    {skill.title}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveSkill('learning', skill.title)} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </form>

        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting} className="rounded-xl px-8 h-12">Cancel</Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} className="rounded-xl px-10 h-12 shadow-xl shadow-indigo-500/20">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
