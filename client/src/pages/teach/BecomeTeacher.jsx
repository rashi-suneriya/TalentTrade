import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Globe, Plus, X } from 'lucide-react';

const BecomeTeacher = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState('');

  const [formData, setFormData] = useState({
    displayName: user?.name || '',
    headline: '',
    bio: '',
    expertise: [],
    socialLinks: {
      youtube: '',
      twitter: '',
      linkedin: '',
      website: ''
    }
  });

  useEffect(() => {
    if (user?.role === 'teacher') {
      navigate('/teach/dashboard');
    }
  }, [user, navigate]);

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

  const addExpertise = (e) => {
    if (e.key === 'Enter' && expertiseInput.trim()) {
      e.preventDefault();
      if (!formData.expertise.includes(expertiseInput.trim())) {
        setFormData(prev => ({
          ...prev,
          expertise: [...prev.expertise, expertiseInput.trim()]
        }));
      }
      setExpertiseInput('');
    }
  };

  const removeExpertise = (tag) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/become-teacher', formData);
      if (res.data.success) {
        localStorage.setItem('accessToken', res.data.accessToken);
        updateUser(res.data.user);
        toast.success('Welcome to the teaching team!');
        navigate('/teach/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upgrade account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[32px] shadow-xl p-8 border border-slate-100 dark:border-slate-800"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Share Your Expertise</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Create high-impact courses and reach thousands of learners.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Public Display Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="e.g. Dr. Sarah Smith"
                required
              />
              <Input
                label="Professional Headline"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. Senior Full Stack Engineer"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Expertise Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.expertise.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-800">
                    {tag}
                    <button type="button" onClick={() => removeExpertise(tag)} className="hover:text-indigo-800">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <Input
                  placeholder="Type a skill and press Enter"
                  value={expertiseInput}
                  onChange={(e) => setExpertiseInput(e.target.value)}
                  onKeyDown={addExpertise}
                />
                <Plus className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Short Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-indigo-500 transition-all min-h-[120px]"
                placeholder="Tell us about your background and teaching philosophy..."
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-500" /> Social Presence (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="LinkedIn URL"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                />
                <Input
                  label="YouTube Channel"
                  name="socialLinks.youtube"
                  value={formData.socialLinks.youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@..."
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg" isLoading={isLoading}>
              Complete Onboarding
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default BecomeTeacher;
