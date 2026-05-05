import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Users, Settings, Share, PenTool, CheckSquare } from 'lucide-react';

const Workspace = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Overview');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch user's projects to show in the workspace overview
    api.get('/api/projects').then(res => setProjects(res.data)).catch(console.error);
  }, []);

  const tabs = ['Overview', 'Members', 'All work', 'Messages', 'Calendar', 'Knowledge'];

  return (
    <div className="flex-1 flex flex-col h-full bg-asana-dark text-asana-text overflow-y-auto">
      
      {/* Workspace Header */}
      <div className="px-6 pt-6 pb-2 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-white font-bold">
              M
            </div>
            <h1 className="text-2xl font-bold text-white">My workspace</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-2">
              <div className="w-8 h-8 rounded-full bg-[#E5A548] border-2 border-asana-dark flex items-center justify-center text-[#5C3F1B] font-bold text-xs z-10">
                {user?.name?.substring(0, 2).toUpperCase() || 'MK'}
              </div>
            </div>
            <button className="flex items-center px-3 py-1.5 rounded-md border border-gray-700 text-sm hover:bg-gray-800 transition-colors bg-[#2A2B2C]">
              <Share className="w-4 h-4 mr-2" /> Share
            </button>
            <button className="flex items-center px-3 py-1.5 rounded-md border border-gray-700 text-sm hover:bg-gray-800 transition-colors bg-[#2A2B2C]">
              <Settings className="w-4 h-4 mr-2" /> Customize
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-white text-white' 
                  : 'border-transparent text-asana-muted hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {activeTab === 'Overview' && (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column */}
            <div className="flex-1 space-y-8">
              <div className="bg-[#2A2B2C] p-6 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <PenTool className="w-4 h-4 text-asana-coral" />
                  <span className="text-white font-medium">AI summary</span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded ml-2">Private to you</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border border-gray-700 rounded hover:border-gray-500 transition-colors cursor-pointer">
                    <div>
                      <h4 className="text-white text-sm font-medium">Recent activity</h4>
                      <p className="text-xs text-asana-muted mt-0.5">Catch up on what's happened in this workspace lately</p>
                    </div>
                    <span className="text-xs text-gray-400">+ Include</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-700 rounded hover:border-gray-500 transition-colors cursor-pointer">
                    <div>
                      <h4 className="text-white text-sm font-medium">Risk report</h4>
                      <p className="text-xs text-asana-muted mt-0.5">Proactively flag potential risks in your projects</p>
                    </div>
                    <span className="text-xs text-gray-400">+ Include</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center border-t border-gray-700 pt-4">
                  <label className="flex items-center text-sm text-gray-400">
                    <input type="checkbox" className="mr-2 rounded bg-gray-700 border-gray-600 text-asana-coral" />
                    Get regular updates
                  </label>
                  <button disabled className="px-4 py-1.5 rounded bg-gray-700 text-gray-500 text-sm font-medium">
                    Generate summary
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Workspace description</h2>
                <p className="text-asana-muted">What's this workspace about?</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Workspace roles</h2>
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                    +
                  </button>
                  <span className="text-sm text-asana-muted">Add member</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E5A548] flex items-center justify-center text-[#5C3F1B] font-bold">
                    {user?.name?.substring(0, 2).toUpperCase() || 'MK'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-xs text-asana-muted">Workspace owner</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="w-full lg:w-80 space-y-8">
              <div>
                <h3 className="text-white font-medium mb-3">What's the status?</h3>
                <div className="flex gap-2 mb-4">
                  <button className="px-3 py-1.5 rounded-full text-xs font-medium border bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20">
                    On track
                  </button>
                  <button className="px-3 py-1.5 rounded-full text-xs font-medium border bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20">
                    At risk
                  </button>
                  <button className="px-3 py-1.5 rounded-full text-xs font-medium border bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20">
                    Off track
                  </button>
                </div>
                
                <div className="flex items-center text-sm text-asana-muted mb-6">
                  <div className="w-5 h-5 border border-dashed border-gray-500 rounded flex items-center justify-center mr-2">
                    <span className="text-[10px]">-</span>
                  </div>
                  No due date
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-3">Recent activity</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-800 before:to-transparent">
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-700 bg-[#2A2B2C] text-gray-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Users className="w-3 h-3" />
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-3">
                      <div className="text-white font-medium text-sm">My workspace team joined</div>
                      <div className="text-xs text-asana-muted mt-1">Just now</div>
                      <div className="w-6 h-6 rounded-full bg-[#E5A548] text-[#5C3F1B] flex items-center justify-center font-bold text-[10px] mt-2">
                        {user?.name?.substring(0, 2).toUpperCase() || 'MK'}
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-700 bg-[#2A2B2C] text-gray-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Users className="w-3 h-3" />
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-3">
                      <div className="text-white font-medium text-sm">You joined</div>
                      <div className="text-xs text-asana-muted mt-1">Just now</div>
                      <div className="w-6 h-6 rounded-full bg-[#E5A548] text-[#5C3F1B] flex items-center justify-center font-bold text-[10px] mt-2">
                        {user?.name?.substring(0, 2).toUpperCase() || 'MK'}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'Overview' && (
          <div className="py-12 flex flex-col items-center justify-center text-asana-muted border border-dashed border-gray-800 rounded-lg">
            <CheckSquare className="w-12 h-12 mb-4 text-gray-700" />
            <h3 className="text-lg font-medium text-white mb-2">{activeTab}</h3>
            <p>This view is ready to be populated with your workspace {activeTab.toLowerCase()}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
