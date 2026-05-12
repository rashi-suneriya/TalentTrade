import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuthStore } from '../store/authStore';
import { Edit3, MapPin, Globe, Award, Star, BookOpen, Repeat, X, Save, Plus, Share2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Use actual user data with defaults
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
        if (err.name !== 'AbortError') {
          toast.error('Could not share profile');
        }
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-indigo-100 dark:bg-indigo-900/30 overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl">
                {profileUser.avatar ? (
                  <img src={profileUser.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-indigo-600">
                    {profileUser.name?.charAt(0)}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 hover:text-indigo-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left mb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{profileUser.name}</h1>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <div className="badge-indigo">{user?.role === 'teacher' ? 'Instructor' : 'Learner'}</div>
                  {user?.isVerified && <div className="badge-green">Verified Pro</div>}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-current" /> {user?.averageRating?.toFixed(1) || '0.0'} ({user?.totalRatings || 0} reviews)
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-500" /> {profileUser.tokens} Tokens
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Button onClick={() => setIsEditModalOpen(true)} className="rounded-2xl px-8 shadow-lg shadow-indigo-500/20">Edit Profile</Button>
              <Button onClick={handleShare} variant="secondary" className="rounded-2xl px-8">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="card">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">About Me</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {profileUser.bio}
              </p>
              <div className="space-y-3">
                {profileUser.socialLinks.website && (
                  <a href={profileUser.socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                    <Globe className="w-4 h-4" /> {profileUser.socialLinks.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-slate-800 dark:text-white mb-6">Skills Exchange</h3>
              
              <div className="mb-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">Teaching</label>
                <div className="flex flex-wrap gap-2">
                  {profileUser.skillsOffered.length > 0 ? (
                    profileUser.skillsOffered.map((skill, i) => (
                      <span key={i} className="badge-indigo py-1.5 px-3">
                        {skill.title}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No skills listed</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">Learning</label>
                <div className="flex flex-wrap gap-2">
                  {profileUser.skillsWanted.length > 0 ? (
                    profileUser.skillsWanted.map((skill, i) => (
                      <span key={i} className="badge-amber py-1.5 px-3">
                        {skill.title}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No skills listed</span>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
              {['overview', 'courses', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-bold capitalize transition-all border-b-2 ${
                    activeTab === tab 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="card bg-white/50 dark:bg-slate-800/50 p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-800 dark:text-white">{user?.coursesCompleted || 0}</div>
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Courses Completed</div>
                    </div>
                  </div>
                  <div className="card bg-white/50 dark:bg-slate-800/50 p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                      <Repeat className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-800 dark:text-white">{user?.totalSwaps || 0}</div>
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Skill Swaps</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-400 text-center py-8">No recent activity to show.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Full Name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            <Input 
              label="Avatar URL" 
              name="avatar" 
              value={formData.avatar} 
              onChange={handleChange} 
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Bio</label>
            <textarea 
              name="bio"
              className="input min-h-[100px] py-3"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              maxLength={300}
            />
            <div className="text-[10px] text-right text-slate-400 font-bold uppercase">{formData.bio.length}/300</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Teaching Skills</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a skill..." 
                  value={skillInput.teaching} 
                  onChange={(e) => setSkillInput({...skillInput, teaching: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('teaching'))}
                />
                <Button type="button" variant="secondary" onClick={() => handleAddSkill('teaching')}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skillsOffered.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full text-xs font-bold flex items-center gap-1.5">
                    {skill.title}
                    <X className="w-3 h-3 cursor-pointer hover:text-indigo-800" onClick={() => handleRemoveSkill('teaching', skill.title)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Learning Skills</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a skill..." 
                  value={skillInput.learning} 
                  onChange={(e) => setSkillInput({...skillInput, learning: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill('learning'))}
                />
                <Button type="button" variant="secondary" onClick={() => handleAddSkill('learning')}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skillsWanted.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-full text-xs font-bold flex items-center gap-1.5">
                    {skill.title}
                    <X className="w-3 h-3 cursor-pointer hover:text-amber-800" onClick={() => handleRemoveSkill('learning', skill.title)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" /> Social Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Website" 
                name="socialLinks.website" 
                value={formData.socialLinks.website} 
                onChange={handleChange} 
                placeholder="https://yourwebsite.com"
              />
              <Input 
                label="GitHub" 
                name="socialLinks.github" 
                value={formData.socialLinks.github} 
                onChange={handleChange} 
                placeholder="github.com/username"
              />
              <Input 
                label="LinkedIn" 
                name="socialLinks.linkedin" 
                value={formData.socialLinks.linkedin} 
                onChange={handleChange} 
                placeholder="linkedin.com/in/username"
              />
            </div>
          </div>
        </form>

        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} className="px-8 shadow-lg shadow-indigo-500/20">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
