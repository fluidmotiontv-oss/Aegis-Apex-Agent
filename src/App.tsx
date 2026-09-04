/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { AgentConfig, AppState } from './types';
import { Landing } from './components/Landing';
import { Configurator } from './components/Configurator';
import { Synthesizer } from './components/Synthesizer';
import { ChatInterface } from './components/ChatInterface';
import { ErrorBoundary } from './components/ErrorBoundary';

const DEFAULT_CONFIG: AgentConfig = {
  name: '',
  directive: '',
  knowledgeBase: '',
  tone: 'Analytical',
  autonomyLevel: 'Supervised',
  guardrails: true,
  memoryRetention: 'Short-Term',
  toolCalling: false
};

export default function App() {
  const [view, setView] = useState<AppState>('landing');
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_CONFIG);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aegis_agent_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
        setView('chat'); // jump straight to chat if already configured
      } catch (e) {
        console.error("Failed to parse saved config", e);
      }
    }
  }, []);

  const handleStart = () => setView('configuring');
  
  const handleDeploy = (validatedConfig: AgentConfig) => {
    setConfig(validatedConfig);
    setView('synthesizing');
  };
  
  const handleSynthesisComplete = () => {
    localStorage.setItem('aegis_agent_config', JSON.stringify(config));
    setView('chat');
  };

  const handleReset = () => {
    localStorage.removeItem('aegis_agent_config');
    setConfig(DEFAULT_CONFIG);
    setView('landing');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
        {/* Technical grid background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full pointer-events-none opacity-30 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full">
            <Landing onStart={handleStart} />
          </motion.div>
        )}
        
        {view === 'configuring' && (
          <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full z-10">
            <Configurator config={config} setConfig={setConfig} onDeploy={handleDeploy} />
          </motion.div>
        )}

        {view === 'synthesizing' && (
          <motion.div key="synth" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="w-full z-10">
            <Synthesizer config={config} onComplete={handleSynthesisComplete} />
          </motion.div>
        )}

        {view === 'chat' && (
          <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full z-10 h-full flex items-center justify-center pt-8">
            <ChatInterface config={config} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
