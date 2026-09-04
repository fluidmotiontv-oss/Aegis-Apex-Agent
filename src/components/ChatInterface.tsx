import { useState, useRef, useEffect } from 'react';
import { AgentConfig, ChatMessage } from '../types';
import { Send, Bot, User, Download, Mic, MicOff, FileText } from 'lucide-react';
import avatarImg from '../assets/images/agent_avatar_1788328950852.jpg';
import { motion } from 'motion/react';

interface Props {
  config: AgentConfig;
  onReset: () => void;
}

export function ChatInterface({ config, onReset }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    role: 'agent',
    content: `Greetings. I am ${config.name || 'Agent'}. My core directive is: ${config.directive || 'unspecified'}. How may I assist you?`,
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setInput(prev => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support the Web Speech API.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleExportJson = () => {
    const payload = {
      systemInstruction: `You are ${config.name}. Core Directive: ${config.directive}`,
      parameters: config,
      version: "1.0-apex"
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name ? config.name.toLowerCase().replace(/\s+/g, '_') : 'agent'}_spec.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportHistory = () => {
    const transcript = messages.map(msg => {
      const timestamp = msg.timestamp.toLocaleString();
      const sender = msg.role === 'user' ? 'User' : (config.name || 'Agent');
      return `[${sender} - ${timestamp}]\n${msg.content}\n`;
    }).join('\n');

    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name ? config.name.toLowerCase().replace(/\s+/g, '_') : 'agent'}_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          systemPrompt: `You are ${config.name}, a highly capable AI agent. Tone: ${config.tone}. Core Directive: ${config.directive}. Base Knowledge: ${config.knowledgeBase}. Constraints: Guardrails ${config.guardrails ? 'ON' : 'OFF'}.`,
          history: messages.slice(1).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();

      if (data.reply) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: data.reply,
          timestamp: new Date()
        }]);
      } else {
        throw new Error(data.error || 'Failed to generate response');
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: "[FALLBACK SYSTEM] Connection to primary neural net lost. Entering offline advisory mode. How may I assist you logically?",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto z-10 flex flex-col h-[85vh] bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-indigo-500/30">
            <img src={avatarImg} alt="Agent" className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">{config.name || 'Agent'}</h3>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE & DEPLOYED
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportHistory} className="flex items-center gap-2 px-4 py-2 text-sm text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 rounded-full transition-colors">
            <FileText className="w-4 h-4" />
            Export History
          </button>
          <button onClick={handleExportJson} className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-full transition-colors">
            <Download className="w-4 h-4" />
            Export Spec
          </button>
          <button onClick={onReset} className="px-4 py-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(msg => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-indigo-500/30'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-400" />}
            </div>
            <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'}`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 rounded-tl-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-4"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              placeholder={isRecording ? "Listening..." : "Initialize conversation..."}
              className={`w-full bg-slate-950 border ${isRecording ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-slate-700'} rounded-full pl-6 pr-14 py-4 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition-all`}
            />
            <button
              type="button"
              onClick={toggleRecording}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isRecording ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              {isRecording ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
            </button>
          </div>
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shrink-0"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
