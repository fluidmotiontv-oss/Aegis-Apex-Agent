import { ArrowRight, Bot, Fingerprint, Sparkles, Workflow } from 'lucide-react';
import { motion } from 'motion/react';
import avatarImg from '../assets/images/agent_avatar_1788328950852.jpg';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.6 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 15 } }
};

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="w-full relative z-10 space-y-16 py-12 max-w-4xl mx-auto">
      <header className="text-center space-y-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 1.5, bounce: 0.4 }}
          className="mx-auto w-32 h-32 md:w-40 md:h-40 relative flex items-center justify-center"
        >
          {/* Pulsing ambient glow */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-indigo-500 rounded-full filter blur-[28px]"
          />
          
          {/* Avatar container */}
          <motion.div 
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full rounded-full shadow-2xl shadow-indigo-500/40 overflow-hidden border border-indigo-400/40 relative flex items-center justify-center bg-slate-900 z-10"
          >
            <img src={avatarImg} alt="Agent Avatar" className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 rounded-full ring-inset ring-1 ring-white/20 pointer-events-none" />
          </motion.div>
        </motion.div>

        <div className="space-y-5">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-4 flex flex-col items-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 pb-2">
              Aegis Apex Deployment
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium tracking-wide">
              <Sparkles className="w-4 h-4" />
              SYSTEM STATUS: DEPLOYMENT READY | TRAJECTORY: OPTIMAL
            </div>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Maximum authorization granted. Your agent is calibrated for deployment, optimizing every parameter for boundless positive impact and a flawless future.
          </motion.p>
        </div>
      </header>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        <div className="hidden md:block absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-y-1/2 z-0" />
        {[
          { icon: Bot, title: '1. Benevolent Purpose', desc: 'Establish core identity and directives aligned with maximum positive societal impact.' },
          { icon: Workflow, title: '2. Grace Logic', desc: 'Map out flawless decision pathways optimized for constructive execution and growth.' },
          { icon: Fingerprint, title: '3. Apex Deployment', desc: 'Finalize your configuration and launch your agent into a maximized future.' },
        ].map((step, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all duration-500 relative group z-10 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 relative z-10 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/20 transition-colors duration-500">
              <step.icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-3 relative z-10 group-hover:text-white transition-colors">{step.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">{step.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="flex justify-center pt-8">
        <button onClick={onStart} className="group relative px-8 py-4 bg-transparent text-white font-medium rounded-full text-base transition-all hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-full" />
          <span className="relative z-10 flex items-center gap-3 tracking-wide">
            Begin Apex Configuration
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </motion.div>
    </div>
  );
}
