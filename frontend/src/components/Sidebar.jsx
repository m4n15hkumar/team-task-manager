import { Link, useLocation } from 'react-router-dom';
import { Home, CheckCircle, Inbox, BarChart2, Briefcase, Target, Plus } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
    return (
      <Link
        to={to}
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
          isActive 
            ? 'bg-asana-hover text-white font-medium' 
            : 'text-asana-muted hover:bg-asana-hover hover:text-white'
        }`}
      >
        <Icon className="w-4 h-4 mr-3" />
        {label}
      </Link>
    );
  };

  return (
    <div className="w-60 bg-asana-sidebar border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto hidden md:flex">
      
      {/* Create Button */}
      <div className="p-4">
        <Link 
          to="/projects"
          className="flex items-center justify-center w-full px-4 py-2 bg-asana-coral text-white rounded-full text-sm font-semibold hover:bg-opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create
        </Link>
      </div>

      {/* Main Nav */}
      <div className="px-2 space-y-1">
        <NavItem to="/" icon={Home} label="Home" />
        <NavItem to="/my-tasks" icon={CheckCircle} label="My tasks" />
        <NavItem to="/inbox" icon={Inbox} label="Inbox" />
      </div>

      {/* Insights */}
      <div className="mt-6 px-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Insights</h3>
        <div className="space-y-1 -mx-2 px-2">
          <NavItem to="/reporting" icon={BarChart2} label="Reporting" />
          <NavItem to="/portfolios" icon={Briefcase} label="Portfolios" />
          <NavItem to="/goals" icon={Target} label="Goals" />
        </div>
      </div>

      {/* Projects */}
      <div className="mt-6 px-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Projects</h3>
          <Link to="/projects" className="text-gray-500 hover:text-white">
            <Plus className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-1 -mx-2 px-2">
          <NavItem to="/projects" icon={Briefcase} label="All Projects" />
        </div>
      </div>

      {/* Team */}
      <div className="mt-4 px-4 mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Team</h3>
        <div className="space-y-1 -mx-2 px-2">
          <Link to="/workspace" className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-asana-muted hover:bg-asana-hover hover:text-white">
            <div className="w-5 h-5 rounded bg-gray-700 flex items-center justify-center text-xs text-white mr-3">M</div>
            My workspace
          </Link>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 mt-auto border-t border-gray-800 space-y-3">
        <div className="flex items-center text-xs text-asana-muted">
          <div className="w-6 h-6 rounded-full border border-green-500 flex items-center justify-center mr-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div>
            <p className="text-white font-medium">Advanced free trial</p>
            <p>14 days left</p>
          </div>
        </div>
        <button className="w-full py-1.5 bg-[#F9CD9A] text-black text-sm font-medium rounded-md hover:bg-opacity-90 transition-opacity">
          Add billing info
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
