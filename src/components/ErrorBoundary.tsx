import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Apex Diagnostics:", error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('aegis_agent_config');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div 
            className="absolute inset-0 z-0 pointer-events-none opacity-20" 
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} 
          />
          <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 relative z-10 shadow-2xl shadow-red-500/10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Apex Diagnostics</h2>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              A critical system fault occurred during the deployment sequence. The trajectory vector could not be resolved due to corrupted state data.
            </p>
            <div className="bg-slate-950 rounded-xl p-4 mb-8 text-left overflow-auto text-xs text-red-300 font-mono border border-red-500/10 max-h-32">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={this.handleReset}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Application State
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
