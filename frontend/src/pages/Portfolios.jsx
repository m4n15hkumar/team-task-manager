import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const Portfolios = () => {
  const [showToast, setShowToast] = useState('');

  const handleFeatureSoon = (feature) => {
    setShowToast(`${feature} feature coming soon!`);
    setTimeout(() => setShowToast(''), 3000);
  };
  return (
    <div className="flex-1 flex flex-col h-full bg-asana-dark text-white overflow-y-auto">
      <div className="px-6 pt-6 pb-2 border-b border-gray-800">
        <h1 className="text-2xl font-bold mb-4">Portfolios</h1>
        <div className="flex gap-6">
          <button className="pb-2 border-b-2 border-white text-white font-medium text-sm">Recent and starred</button>
          <button className="pb-2 border-b-2 border-transparent text-asana-muted hover:text-gray-300 text-sm">Browse all</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-8 max-w-4xl mx-auto w-full text-center mt-12">
        <h2 className="text-2xl font-semibold mb-3">Get the big picture with portfolios</h2>
        <p className="text-asana-muted mb-8 max-w-lg">
          Monitor status and team-member workload across multiple projects. 
          Asana can help you set up your first portfolio.
        </p>
        <button onClick={() => handleFeatureSoon('Portfolios')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors mb-16">
          Explore portfolios
        </button>

        {/* Mock Graphic mimicking the screenshot */}
        <div className="relative w-full max-w-3xl border border-gray-800 bg-[#2A2B2C] rounded-t-xl overflow-hidden shadow-2xl opacity-50 pointer-events-none">
          <div className="p-4 border-b border-gray-700 text-left flex items-center">
             <h3 className="text-xl font-bold mr-4">Strategic Initiatives</h3>
             <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-500">On track</span>
          </div>
          <table className="min-w-full text-left text-sm text-asana-muted">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="p-4">Project Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Budget</th>
                <th className="p-4">Task Progress</th>
                <th className="p-4">Client</th>
                <th className="p-4">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="p-4"><div className="w-32 h-3 bg-gray-600 rounded"></div></td>
                <td className="p-4"><span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500">At risk</span></td>
                <td className="p-4 text-white">$1,250,000</td>
                <td className="p-4 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden"><div className="w-[52%] h-full bg-yellow-500"></div></div>
                  <span className="text-xs">52%</span>
                </td>
                <td className="p-4"><span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">Adobe</span></td>
                <td className="p-4"><div className="w-6 h-6 rounded-full bg-gray-600"></div></td>
              </tr>
              <tr>
                <td className="p-4"><div className="w-24 h-3 bg-gray-600 rounded"></div></td>
                <td className="p-4"><div className="w-16 h-5 bg-gray-700 rounded-full"></div></td>
                <td className="p-4"><div className="w-20 h-3 bg-gray-700 rounded"></div></td>
                <td className="p-4"><div className="w-24 h-1.5 bg-gray-700 rounded-full"></div></td>
                <td className="p-4"><div className="w-16 h-5 bg-teal-500/20 rounded-full"></div></td>
                <td className="p-4"><div className="w-6 h-6 rounded-full bg-gray-600"></div></td>
              </tr>
              <tr>
                <td className="p-4"><div className="w-36 h-3 bg-gray-600 rounded"></div></td>
                <td className="p-4"><div className="w-16 h-5 bg-gray-700 rounded-full"></div></td>
                <td className="p-4"><div className="w-20 h-3 bg-gray-700 rounded"></div></td>
                <td className="p-4"><div className="w-24 h-1.5 bg-gray-700 rounded-full"></div></td>
                <td className="p-4"><div className="w-16 h-5 bg-yellow-500/20 rounded-full"></div></td>
                <td className="p-4"><div className="w-6 h-6 rounded-full bg-gray-600"></div></td>
              </tr>
            </tbody>
          </table>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-asana-dark to-transparent"></div>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-[#2A2B2C] text-white px-4 py-3 rounded-lg shadow-lg border border-gray-700 flex items-center z-50 animate-fade-in-up">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          {showToast}
        </div>
      )}
    </div>
  );
};

export default Portfolios;
