import React, { useState } from 'react';
import { BarChart2, CheckCircle } from 'lucide-react';

const Reporting = () => {
  const [showToast, setShowToast] = useState('');

  const handleFeatureSoon = (feature) => {
    setShowToast(`${feature} feature coming soon!`);
    setTimeout(() => setShowToast(''), 3000);
  };
  return (
    <div className="flex-1 flex flex-col h-full bg-asana-dark text-white overflow-y-auto">
      <div className="px-6 pt-6 pb-2 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Reporting</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full text-center">
        <h2 className="text-2xl font-semibold mb-3">See teamwork from every angle</h2>
        <p className="text-asana-muted mb-8 max-w-xl">
          Get insights with charts using real-time data across teams, projects—even departments. 
          Asana can help you set up your first dashboard.
        </p>
        <button onClick={() => handleFeatureSoon('Advanced Reporting')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors mb-16">
          Get started
        </button>

        {/* Abstract Graphic mimicking the screenshot */}
        <div className="relative w-full max-w-3xl aspect-[2/1] bg-[#222324] rounded-xl border border-gray-800 p-8 flex items-center justify-center overflow-hidden shadow-2xl">
          {/* Background connectors */}
          <svg className="absolute inset-0 w-full h-full text-gray-700" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none">
            <path d="M 200,100 L 400,100 L 400,200 L 600,200" />
            <path d="M 100,250 L 300,250 L 300,350 L 500,350" />
            <path d="M 600,100 L 500,100 L 500,300 L 700,300" />
          </svg>
          
          <div className="grid grid-cols-2 gap-6 w-full h-full relative z-10">
            {/* Chart Block 1 */}
            <div className="bg-[#2A2B2C] border border-gray-700 rounded-lg p-4 shadow-lg flex flex-col justify-end">
              <div className="flex gap-2 items-end h-24 justify-around">
                <div className="w-4 bg-purple-500 rounded-t h-[60%] relative"><div className="w-6 h-6 rounded-full bg-purple-300 absolute -bottom-8 -left-1"></div></div>
                <div className="w-4 bg-pink-500 rounded-t h-[40%] relative"><div className="w-6 h-6 rounded-full bg-pink-300 absolute -bottom-8 -left-1"></div></div>
                <div className="w-4 bg-yellow-500 rounded-t h-[80%] relative"><div className="w-6 h-6 rounded-full bg-yellow-300 absolute -bottom-8 -left-1"></div></div>
                <div className="w-4 bg-green-500 rounded-t h-[50%] relative"><div className="w-6 h-6 rounded-full bg-green-300 absolute -bottom-8 -left-1"></div></div>
                <div className="w-4 bg-blue-500 rounded-t h-[90%] relative"><div className="w-6 h-6 rounded-full bg-blue-300 absolute -bottom-8 -left-1"></div></div>
              </div>
            </div>
            {/* Chart Block 2 */}
            <div className="bg-[#2A2B2C] border border-gray-700 rounded-lg p-4 shadow-lg flex flex-col justify-end">
              <div className="flex gap-3 items-end h-24">
                <div className="w-8 bg-blue-500 rounded-t h-[70%]"></div>
                <div className="w-8 bg-teal-500 rounded-t h-[90%]"></div>
                <div className="w-8 bg-orange-500 rounded-t h-[50%]"></div>
                <div className="w-8 bg-yellow-500 rounded-t h-[80%]"></div>
              </div>
            </div>
            {/* Chart Block 3 */}
            <div className="bg-[#2A2B2C] border border-gray-700 rounded-lg p-4 shadow-lg flex flex-col justify-end">
              <div className="flex gap-2 items-end h-24">
                <div className="w-6 bg-blue-600 rounded-t h-[40%]"></div>
                <div className="w-6 bg-blue-500 rounded-t h-[60%]"></div>
                <div className="w-6 bg-blue-400 rounded-t h-[80%]"></div>
                <div className="w-6 bg-blue-300 rounded-t h-[100%]"></div>
                <div className="w-6 bg-blue-200 rounded-t h-[50%]"></div>
              </div>
            </div>
            {/* Chart Block 4 */}
            <div className="bg-[#2A2B2C] border border-gray-700 rounded-lg p-4 shadow-lg flex items-center justify-between">
              <div className="w-24 h-24 rounded-full border-[12px] border-gray-600 relative">
                 <div className="absolute inset-0 rounded-full border-[12px] border-green-500" style={{clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)'}}></div>
                 <div className="absolute inset-0 rounded-full border-[12px] border-yellow-500" style={{clipPath: 'polygon(50% 50%, 0 100%, 100% 100%)'}}></div>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-2 bg-gray-600 rounded"></div>
                <div className="w-12 h-2 bg-gray-600 rounded"></div>
                <div className="w-20 h-2 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Floating Icons */}
          <div className="absolute top-10 left-10 w-8 h-8 bg-purple-300 rounded shadow-lg flex items-center justify-center text-purple-800"><BarChart2 size={16}/></div>
          <div className="absolute bottom-10 left-20 w-8 h-8 bg-orange-300 rounded shadow-lg"></div>
          <div className="absolute top-20 right-20 w-8 h-8 bg-yellow-300 rounded shadow-lg rotate-45"></div>
          <div className="absolute bottom-10 right-10 w-8 h-8 bg-teal-300 rounded-full shadow-lg"></div>
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

export default Reporting;
