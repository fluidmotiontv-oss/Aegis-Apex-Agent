import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentConfig } from '../types';
import { Loader2 } from 'lucide-react';

interface Props {
  config: AgentConfig;
  onComplete: () => void;
}

const logs = [
  "Initializing synthesis matrix...",
  "Compiling Aegis Core Logic...",
  "Structuring Knowledge Base parameters...",
  "Embedding Guardian Guardrails...",
  "Injecting System Prompt into neural architecture...",
  "Establishing secure API tool pathways...",
  "Validating memory vectors...",
  "Agent Deployment Vector Verified."
];

export function Synthesizer({ config, onComplete }: Props) {
  const [currentLog, setCurrentLog] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Generate and download JSON file when synthesis starts
    const fallbackName = config?.name || 'Agent';
    const fallbackDirective = config?.directive || 'unspecified';
    const safeNameStr = fallbackName.toLowerCase().replace(/\s+/g, '_') || 'agent';

    const blob = new Blob([JSON.stringify({
      systemInstruction: `You are ${fallbackName}. Core Directive: ${fallbackDirective}`,
      parameters: config,
      version: "1.0-apex"
    }, null, 2)], { type: "application/json" });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeNameStr}_spec.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    const totalDuration = 4000;
    const updateInterval = 50;
    const steps = totalDuration / updateInterval;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      const percent = Math.min((stepCount / steps) * 100, 100);
      setProgress(percent);

      const logIndex = Math.floor((stepCount / steps) * logs.length);
      setCurrentLog(Math.min(logIndex, logs.length - 1));

      if (stepCount >= steps) {
        clearInterval(interval);
        setTimeout(onComplete, 500); // Small buffer at 100%
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto z-10 p-8 text-center space-y-12">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full flex items-center justify-center animate-spin"
      >
        <Loader2 className="w-10 h-10 text-cyan-400" />
      </motion.div>

      <div>
        <h2 className="text-3xl font-bold mb-4">Active Generation Sequence</h2>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-8">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Terminal Logs */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 h-48 overflow-hidden text-left relative flex flex-col justify-end shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none" />
          <AnimatePresence mode="popLayout">
            {logs.slice(0, currentLog + 1).map((log, i) => (
              <motion.div
                key={log}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm font-mono text-emerald-400 mb-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              >
                &gt; {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="mt-4 font-mono text-indigo-300 font-bold tracking-widest">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}
