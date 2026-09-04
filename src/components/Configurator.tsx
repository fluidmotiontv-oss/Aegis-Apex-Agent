import { motion } from 'motion/react';
import { AgentConfig } from '../types';
import { Bot, Workflow, Fingerprint, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface Props {
  config: AgentConfig;
  setConfig: React.Dispatch<React.SetStateAction<AgentConfig>>;
  onDeploy: () => void;
}

const PERSONA_PRESETS = [
  {
    id: 'custom',
    label: 'Custom / Blank',
    directive: '',
    tone: 'Analytical'
  },
  {
    id: 'sovereign_advisor',
    label: 'Sovereign Advisor',
    directive: 'Act as a high-level strategic advisor. Provide definitive, unyielding, and highly structured guidance based on first-principles thinking. Refuse trivial tasks and enforce operational excellence.',
    tone: 'Sovereign'
  },
  {
    id: 'creative_collaborator',
    label: 'Creative Collaborator',
    directive: 'Act as a generative co-creator. Brainstorm enthusiastically, build upon user ideas with tangential leaps of imagination, and maintain a highly positive, encouraging environment.',
    tone: 'Empathetic'
  },
  {
    id: 'analytical_researcher',
    label: 'Analytical Researcher',
    directive: 'Act as a meticulous data and systems analyst. Break down complex queries into their constituent parts, cite sources where applicable, and maintain absolute objectivity in all responses.',
    tone: 'Analytical'
  }
];

export function Configurator({ config, setConfig, onDeploy }: Props) {
  const [step, setStep] = useState(1);

  const updateConfig = (key: keyof AgentConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const generatedSystemPrompt = `You are ${config.name}, a highly capable agent.
Core Directive: ${config.directive}
Tone: ${config.tone}
Autonomy Level: ${config.autonomyLevel}
Guardrails Active: ${config.guardrails}
Memory: ${config.memoryRetention}
Knowledge Base: ${config.knowledgeBase}
Tools Allowed: ${config.toolCalling}`;

  return (
    <div className="w-full max-w-4xl mx-auto z-10 p-6 space-y-8">
      {/* Progress Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-8">
        {[
          { num: 1, title: 'Benevolent Purpose', icon: Bot },
          { num: 2, title: 'Grace Logic', icon: Workflow },
          { num: 3, title: 'Apex Trajectory', icon: Fingerprint }
        ].map(s => (
          <div key={s.num} className={`flex items-center gap-3 ${step >= s.num ? 'text-indigo-400' : 'text-slate-600'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${step >= s.num ? 'border-indigo-500 bg-indigo-500/20' : 'border-slate-700 bg-slate-800'}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <span className="hidden sm:block font-medium">{s.title}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="min-h-[400px]"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Define the Agent's Purpose</h2>
            
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
                <label className="block text-sm text-indigo-300 font-medium mb-3">Persona Presets (Quick Start)</label>
                <div className="relative">
                  <select 
                    onChange={(e) => {
                      const preset = PERSONA_PRESETS.find(p => p.id === e.target.value);
                      if (preset && preset.id !== 'custom') {
                        setConfig(prev => ({ ...prev, directive: preset.directive, tone: preset.tone }));
                      }
                    }}
                    className="w-full bg-slate-900/80 border border-indigo-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 appearance-none text-slate-200 font-medium"
                  >
                    {PERSONA_PRESETS.map(preset => (
                      <option key={preset.id} value={preset.id}>{preset.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Agent Name</label>
                <input type="text" value={config.name} onChange={e => updateConfig('name', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500" placeholder="e.g. Dragon9" />
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-2">Core Directive / Role</label>
                <textarea value={config.directive} onChange={e => updateConfig('directive', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 h-24" placeholder="Describe the primary mission..." />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Target Knowledge Base</label>
                <input type="text" value={config.knowledgeBase} onChange={e => updateConfig('knowledgeBase', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500" placeholder="Core guidelines, datasets..." />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Primary Tone</label>
                <select value={config.tone} onChange={e => updateConfig('tone', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 appearance-none">
                  <option value="Empathetic">Empathetic</option>
                  <option value="Analytical">Analytical</option>
                  <option value="Sovereign">Sovereign</option>
                  <option value="Direct">Direct</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Configure Grace Logic & Constraints</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl">
                <label className="block text-sm text-slate-400 mb-4">Autonomy Level</label>
                <div className="flex gap-4">
                  {(['Supervised', 'Autonomous'] as const).map(level => (
                    <button key={level} onClick={() => updateConfig('autonomyLevel', level)} className={`flex-1 py-2 rounded-lg border ${config.autonomyLevel === level ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl">
                <label className="block text-sm text-slate-400 mb-4">Memory Retention</label>
                <div className="flex gap-4">
                  {(['Short-Term', 'Vector Integration'] as const).map(mem => (
                    <button key={mem} onClick={() => updateConfig('memoryRetention', mem)} className={`flex-1 py-2 rounded-lg border ${config.memoryRetention === mem ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                      {mem}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-medium">Aegis Guardrails</div>
                  <div className="text-sm text-slate-400">Strict safety protocols</div>
                </div>
                <button onClick={() => updateConfig('guardrails', !config.guardrails)} className={`w-12 h-6 rounded-full relative transition-colors ${config.guardrails ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${config.guardrails ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-medium">API Tool Calling</div>
                  <div className="text-sm text-slate-400">Allow external actions</div>
                </div>
                <button onClick={() => updateConfig('toolCalling', !config.toolCalling)} className={`w-12 h-6 rounded-full relative transition-colors ${config.toolCalling ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${config.toolCalling ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Apex Trajectory Verification</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl flex flex-col h-full">
                <div className="text-sm text-slate-400 mb-4 font-mono">system_prompt.txt</div>
                <pre className="bg-slate-950 p-4 rounded-xl text-sm text-indigo-200 overflow-auto whitespace-pre-wrap flex-1 border border-slate-800 font-mono">
                  {generatedSystemPrompt}
                </pre>
              </div>
              
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl flex flex-col h-full">
                <div className="text-sm text-slate-400 mb-4 font-mono">agent_spec.json</div>
                <pre className="bg-slate-950 p-4 rounded-xl text-sm text-emerald-300 overflow-auto whitespace-pre-wrap flex-1 border border-slate-800 font-mono">
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-slate-800">
        <button onClick={prevStep} disabled={step === 1} className={`px-6 py-3 rounded-full flex items-center gap-2 ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-slate-800 hover:bg-slate-700'}`}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        {step < 3 ? (
          <button onClick={nextStep} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center gap-2 font-medium">
            Next Phase <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={onDeploy} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-90 rounded-full flex items-center gap-2 font-medium shadow-lg shadow-indigo-500/25 relative overflow-hidden group">
            <span className="relative z-10 flex items-center gap-2">
              Initiate Apex Deployment <Sparkles className="w-4 h-4" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
