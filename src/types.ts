export interface AgentConfig {
  name: string;
  directive: string;
  knowledgeBase: string;
  tone: string;
  autonomyLevel: 'Supervised' | 'Autonomous';
  guardrails: boolean;
  memoryRetention: 'Short-Term' | 'Vector Integration';
  toolCalling: boolean;
}

export type AppState = 'landing' | 'configuring' | 'synthesizing' | 'chat';

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}
