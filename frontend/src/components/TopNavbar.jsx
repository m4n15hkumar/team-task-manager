import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, Plus, HelpCircle, Bell, Menu } from 'lucide-react';

const TopNavbar = ({ onMenuClick }) => {
  const { user, logout } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="h-14 bg-asana-sidebar border-b border-gray-800 flex items-center justify-between px-4 sticky top-0 z-20">
      
      {/* Left / Center: Menu & Search */}
      <div className="flex items-center flex-1">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-asana-muted hover:text-white mr-4"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-xl flex items-center bg-[#2A2B2C] rounded-full px-4 py-1.5 border border-transparent focus-within:border-gray-600 transition-colors mx-auto md:ml-0 md:mr-auto">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center space-x-3 ml-4">
        <button className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-asana-hover transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-asana-hover transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="relative ml-2">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full bg-[#E5A548] text-[#5C3F1B] flex items-center justify-center font-bold text-sm focus:outline-none"
          >
            {user?.name?.substring(0, 2).toUpperCase() || 'MK'}
          </button>
          
          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#2A2B2C] border border-gray-700 rounded-md shadow-xl py-1 z-50">
              <div className="px-4 py-3 text-sm text-gray-300 border-b border-gray-700 truncate">
                {user?.email}
              </div>
              <button 
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-asana-coral hover:bg-gray-800 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
