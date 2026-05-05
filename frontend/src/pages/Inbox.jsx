import { useState } from 'react';
import { Filter, ArrowUpDown, AlignLeft, Sparkles, X, User } from 'lucide-react';

const Inbox = () => {
  const [activeTab, setActiveTab] = useState('Activity');

  return (
    <div className="flex-1 flex flex-col h-full bg-asana-dark text-white overflow-hidden">
      
      {/* Header */}
      <div className="px-6 pt-6 pb-2 border-b border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <button className="px-3 py-1.5 rounded-md border border-gray-700 text-sm hover:bg-gray-800 transition-colors bg-[#2A2B2C]">
            Manage notifications
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6">
          {['Activity', 'Bookmarks', 'Archive', '@Mentioned'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-medium text-sm transition-colors border-b-2 ${
                activeTab === tab 
                  ? 'border-white text-white' 
                  : 'border-transparent text-asana-muted hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
          <button className="pb-2 text-asana-muted hover:text-gray-300 border-b-2 border-transparent">+</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs font-medium text-asana-muted">
          <button className="flex items-center hover:text-white transition-colors">
            <Filter className="w-3.5 h-3.5 mr-1.5" /> Filter
          </button>
          <button className="flex items-center hover:text-white transition-colors">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" /> Sort: Newest
          </button>
          <button className="flex items-center hover:text-white transition-colors">
            <AlignLeft className="w-3.5 h-3.5 mr-1.5" /> Density: Detailed
          </button>
        </div>
        <button className="text-asana-muted hover:text-white">...</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        
        {/* Inbox Summary (AI) */}
        <div className="bg-[#2A2B2C] border border-gray-700 rounded-lg p-5 mb-8 relative">
          <button className="absolute top-4 right-4 text-asana-muted hover:text-white">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-asana-coral" />
            <h3 className="text-white font-medium">Inbox Summary</h3>
          </div>
          <p className="text-sm text-asana-muted mb-4">
            Summarize your most important and actionable notifications with Asana AI.
          </p>
          <div className="flex items-center justify-between">
            <select className="bg-transparent text-sm text-asana-muted focus:outline-none border-none cursor-pointer">
              <option>Timeframe: Past week</option>
            </select>
            <button className="px-4 py-1.5 rounded border border-gray-600 text-sm font-medium hover:bg-gray-800 transition-colors">
              View summary
            </button>
          </div>
        </div>

        {/* Notifications Group */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-white mb-3">Today</h3>
          
          <div className="flex items-start gap-4 hover:bg-[#222324] p-3 -mx-3 rounded-lg transition-colors cursor-pointer group relative">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white">Teamwork makes work happen!</h4>
              <p className="text-xs text-asana-muted mt-0.5 mb-1">
                Yeti • 27 minutes ago
              </p>
              <p className="text-sm text-gray-300">
                Inbox is where you get updates, notifications, and messages from your teammates. Send an invite to start collaborating.
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
          </div>
        </div>

        <button className="text-xs text-asana-coral font-medium hover:underline mt-4">
          Archive all notifications
        </button>
      </div>
    </div>
  );
};

export default Inbox;
