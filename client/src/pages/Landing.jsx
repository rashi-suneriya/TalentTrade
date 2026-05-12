import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Repeat, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold mb-6">
              New: AI-Powered Learning Paths 🚀
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
              Swap Skills, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-amber-500">
                Grow Together.
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              SkillSwap is the world's first peer-to-peer learning ecosystem. Exchange your expertise for knowledge, learn from pros, and level up with AI tutors.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button className="h-14 px-10 text-lg rounded-2xl shadow-xl shadow-indigo-500/20">
                  Start Swapping Free
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" className="h-14 px-10 text-lg rounded-2xl bg-white/50 dark:bg-slate-900/50">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-center gap-12 md:gap-24"
          >
            {[
              { label: 'Skills Offered', value: '10k+' },
              { label: 'Active Learners', value: '50k+' },
              { label: 'Swaps Completed', value: '25k+' },
              { label: 'Rating', value: '4.9/5' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose SkillSwap?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Everything you need to master new skills and share yours with the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Repeat className="w-8 h-8" />,
                title: 'Skill Exchange',
                desc: 'Find partners based on what you want to learn and what you can teach. AI matching makes it easy.'
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: 'Video Courses',
                desc: 'Access thousands of high-quality courses or create your own and earn SkillTokens.'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'AI Tutoring',
                desc: 'Stuck on a lesson? Our AI Tutor is available 24/7 to explain concepts and answer questions.'
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm"
              >
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-indigo-600 rounded-[40px] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-500/40">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to level up your skills?</h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of learners and experts today. No credit card required to start swapping.
              </p>
              <Link to="/register">
                <Button className="h-14 px-12 bg-white text-indigo-600 hover:bg-indigo-50 text-xl font-bold rounded-2xl">
                  Get Started Now <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-12 border-t border-slate-100 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>© 2024 SkillSwap Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
