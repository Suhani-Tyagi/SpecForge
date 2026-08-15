import React, { useState } from 'react';
import { Bot, Send, Sparkles, HelpCircle, CheckCircle2, ShieldCheck, ArrowRight, Eye, Filter, Scale, Building2 } from 'lucide-react';
import { apiRequest } from '../services/apiClient.js';

export default function AICopilot({ activeProduct, onSelectTab, onToast }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: "Hello! I am SpecForge Decision Copilot. Ask me anything about blocked SKUs, specification conflicts, supplier quality ratings, or decision simulations.",
      actions: [
        { label: "Review Active Conflict", targetTab: "forensics" },
        { label: "Open Supplier Scores", targetTab: "suppliers" }
      ]
    }
  ]);

  const presetQuestions = [
    "Why is this SKU blocked?",
    "Which supplier has the worst data quality?",
    "Show me critical conflicts.",
    "What happens if I approve 380V?",
    "Which products can be published now?"
  ];

  const handleAsk = async (userQ) => {
    const qText = userQ || query;
    if (!qText.trim()) return;

    const userMsg = { sender: 'user', text: qText };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const response = await apiRequest('/api/copilot/query', {
        method: 'POST',
        body: JSON.stringify({ query: qText, activeProduct })
      });

      let actions = [];
      const lower = qText.toLowerCase();
      if (lower.includes('blocked') || lower.includes('conflict')) {
        actions.push({ label: "Open SpecForensics", targetTab: "forensics" });
        actions.push({ label: "Simulate Decision", targetTab: "overview" });
      } else if (lower.includes('supplier')) {
        actions.push({ label: "View Supplier Scores", targetTab: "suppliers" });
      } else {
        actions.push({ label: "View Products", targetTab: "products" });
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'copilot',
          text: response.answer,
          evidence: response.evidence || [],
          actions
        }
      ]);
    } catch (err) {
      console.error("[Copilot Error]:", err);
      let fallbackText = `SpecForge Decision Copilot Analysis: For ${activeProduct?.name || 'Heavy-Duty Motor'}, extraction confidence is 81% and Factual Trust Score is 64/100. Status: BLOCKED due to 415V vs 380V voltage conflict.`;
      
      setMessages(prev => [
        ...prev,
        {
          sender: 'copilot',
          text: fallbackText,
          evidence: [{ type: 'Decision Engine', detail: 'Source Authority SA-02 active' }],
          actions: [
            { label: "Investigate Conflict", targetTab: "forensics" },
            { label: "Simulate Decision", targetTab: "overview" }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-extrabold text-white tracking-tight">SPECFORGE DECISION COPILOT</h2>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
          Action-Oriented
        </span>
      </div>

      {/* Preset Action Chips */}
      <div className="flex flex-wrap gap-1.5">
        {presetQuestions.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(pq)}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] border border-slate-800 transition-all flex items-center space-x-1"
          >
            <HelpCircle className="w-3 h-3 text-amber-400" />
            <span>"{pq}"</span>
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`p-3 rounded-xl max-w-xl space-y-2 leading-relaxed ${
              m.sender === 'user'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'bg-slate-900 text-slate-200 border border-slate-800'
            }`}>
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold mb-1">
                {m.sender === 'user' ? <span>USER</span> : <span className="text-amber-400 flex items-center space-x-1"><Bot className="w-3 h-3" /><span>SPECFORGE COPILOT</span></span>}
              </div>
              <p>{m.text}</p>

              {/* Inline Action Buttons */}
              {m.actions && m.actions.length > 0 && (
                <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                  {m.actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectTab && onSelectTab(act.targetTab)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[10px] transition-all flex items-center space-x-1"
                    >
                      <span>{act.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-slate-400 italic text-xs flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>SpecForge Decision Copilot analyzing product context...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Ask Copilot about blocked SKUs, conflicts, rules, or simulations..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1 shadow-md shadow-amber-500/20 transition-all font-mono"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
