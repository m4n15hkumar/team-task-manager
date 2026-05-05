import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { CheckCircle, MoreHorizontal, Rocket, Layers, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreatingInline, setIsCreatingInline] = useState(false);
  const [inlineTaskTitle, setInlineTaskTitle] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', dueDate: '', priority: 'Medium', projectId: '' });
  const [showToast, setShowToast] = useState('');
  
  useEffect(() => {
    fetchTasks();
    api.get('/api/projects').then(res => {
      setProjects(res.data);
      if (res.data.length > 0) setTaskForm(prev => ({ ...prev, projectId: res.data[0]._id }));
    }).catch(console.error);
  }, []);

  const fetchTasks = () => {
    api.get('/api/tasks/my').then(res => setTasks(res.data)).catch(console.error);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/tasks', { ...taskForm });
      setTasks([...tasks, res.data]);
      setIsTaskModalOpen(false);
      setTaskForm({ title: '', dueDate: '', priority: 'Medium', projectId: projects.length > 0 ? projects[0]._id : '' });
      setShowToast('Task created successfully');
      setTimeout(() => setShowToast(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleInlineTaskCreate = async (e) => {
    if (e.key === 'Enter' && inlineTaskTitle.trim()) {
      try {
        const payload = {
          title: inlineTaskTitle,
          dueDate: '',
          priority: 'Medium',
          projectId: projects.length > 0 ? projects[0]._id : '',
        };
        const res = await api.post('/api/tasks', payload);
        setTasks([...tasks, res.data]);
        setInlineTaskTitle(''); // Keep input open for next row
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to create task');
      }
    }
  };

  const handleFeatureSoon = (feature) => {
    setShowToast(`${feature} feature coming soon!`);
    setTimeout(() => setShowToast(''), 3000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-asana-dark text-white overflow-y-auto px-8 py-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">{getGreeting()}, {user?.name?.split(' ')[0] || 'User'}</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => handleFeatureSoon('My week')} className="px-3 py-1.5 bg-[#2A2B2C] text-sm text-white rounded border border-gray-700 hover:bg-gray-800">My week</button>
          <div className="text-sm text-asana-muted flex items-center"><CheckCircle className="w-4 h-4 mr-1.5"/> {tasks.filter(t => t.status === 'Done').length} tasks completed</div>
          <div className="text-sm text-asana-muted flex items-center"><span className="w-4 h-4 mr-1.5 bg-gray-700 rounded-full flex items-center justify-center text-[10px]">0</span> collaborators</div>
          <button onClick={() => handleFeatureSoon('Customize')} className="px-3 py-1.5 bg-[#2A2B2C] text-sm text-white rounded border border-gray-700 hover:bg-gray-800 ml-2 flex items-center">Customize</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto w-full">
        
        {/* My Tasks Widget */}
        <div className="bg-[#222324] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5A548] text-[#5C3F1B] flex items-center justify-center font-bold text-xs">
                {user?.name?.substring(0, 2).toUpperCase() || 'MK'}
              </div>
              <h2 className="text-lg font-bold">My tasks</h2>
            </div>
            <button className="text-gray-400 hover:text-white"><MoreHorizontal className="w-5 h-5"/></button>
          </div>
          
          <div className="px-4 border-b border-gray-800">
            <div className="flex gap-6">
              {['Upcoming', 'Overdue', 'Completed'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 border-b-2 text-sm font-medium transition-colors ${activeTab === tab ? 'border-white text-white' : 'border-transparent text-asana-muted hover:text-gray-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#2A2B2C]">
            <div className="px-4 py-3 border-b border-gray-800">
               <button onClick={() => setIsCreatingInline(true)} className="text-asana-muted text-sm flex items-center hover:text-white transition-colors">
                 <span className="mr-2 text-lg font-light">+</span> Create task
               </button>
            </div>
            
            <div className="flex flex-col">
              {isCreatingInline && (
                <div className="flex items-center px-4 py-2 bg-[#1E1E1E] border-y border-blue-500 relative transition-all">
                  <div className="w-4 h-4 rounded-full border border-gray-500 mr-3 shrink-0"></div>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Write a task name"
                    value={inlineTaskTitle}
                    onChange={(e) => setInlineTaskTitle(e.target.value)}
                    onKeyDown={handleInlineTaskCreate}
                    onBlur={() => { if (!inlineTaskTitle.trim()) setIsCreatingInline(false); }}
                    className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none placeholder-gray-500 py-1"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs flex items-center gap-2">
                    <span className="opacity-0 group-focus-within:opacity-100 transition-opacity">Press Enter to save</span>
                  </div>
                </div>
              )}
              {(() => {
                let filtered = tasks;
                if (activeTab === 'Upcoming') filtered = tasks.filter(t => t.status !== 'Done' && (!t.dueDate || new Date(t.dueDate) >= new Date()));
                if (activeTab === 'Overdue') filtered = tasks.filter(t => t.status !== 'Done' && t.dueDate && new Date(t.dueDate) < new Date());
                if (activeTab === 'Completed') filtered = tasks.filter(t => t.status === 'Done');

                if (filtered.length === 0 && !isCreatingInline) {
                  return <div className="text-sm text-asana-muted py-8 text-center">No {activeTab.toLowerCase()} tasks</div>;
                }

                return filtered.slice(0, 5).map(task => (
                  <div key={task._id} className="flex items-center justify-between px-4 py-3 border-b border-gray-800 hover:bg-[#1E1E1E] cursor-pointer transition-colors group">
                    <div className="flex items-center text-sm font-medium text-gray-200">
                      <div className="w-4 h-4 rounded-full border border-gray-500 mr-3 shrink-0 group-hover:border-green-500 transition-colors"></div>
                      <span className="truncate">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs shrink-0">
                      {task.project && (
                        <span className="flex items-center text-gray-400">
                          <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5 shrink-0"></span>
                          <span className="truncate max-w-[100px]">{task.project.name}</span>
                        </span>
                      )}
                      <span className="text-asana-muted w-24 text-right">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Learn Asana Widget */}
        <div className="bg-[#222324] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">Learn</h2>
            <button className="text-gray-400 hover:text-white"><MoreHorizontal className="w-5 h-5"/></button>
          </div>
          
          <div className="p-6 flex gap-4 overflow-x-auto pb-8">
            {/* Card 1 */}
            <div className="min-w-[280px] bg-[#1E1E1E] border border-gray-800 rounded-lg overflow-hidden group cursor-pointer hover:border-gray-500 transition-colors">
              <div className="h-40 bg-[#831A47] flex items-center justify-center relative">
                <Rocket className="w-16 h-16 text-white" />
                <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1"/> 3 min
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1 group-hover:text-asana-coral transition-colors">Getting started</h3>
                <p className="text-xs text-asana-muted">Learn the basics and see how Asana helps you get work done.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="min-w-[280px] bg-[#1E1E1E] border border-gray-800 rounded-lg overflow-hidden group cursor-pointer hover:border-gray-500 transition-colors">
              <div className="h-40 bg-[#831A47] flex items-center justify-center relative">
                <Layers className="w-16 h-16 text-white" />
                <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1"/> 3 min
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1 group-hover:text-asana-coral transition-colors">Automate work with rules</h3>
                <p className="text-xs text-asana-muted">Learn how to streamline work by automating tasks in Asana.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="min-w-[280px] bg-[#1E1E1E] border border-gray-800 rounded-lg overflow-hidden group cursor-pointer hover:border-gray-500 transition-colors">
              <div className="h-40 bg-[#831A47] flex items-center justify-center relative">
                <BarChart className="w-16 h-16 text-white" />
                <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1"/> 15 min
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1 group-hover:text-asana-coral transition-colors">Manage projects in Asana</h3>
                <p className="text-xs text-asana-muted">Plan, organize, and manage your projects effectively.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-[#2A2B2C] text-white px-4 py-3 rounded-lg shadow-lg border border-gray-700 flex items-center z-50 animate-fade-in-up">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          {showToast}
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={() => setIsTaskModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-[#2A2B2C] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Create Quick Task</h3>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-asana-muted">Task Name</label>
                  <input type="text" required value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white focus:border-asana-coral outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-asana-muted">Project *</label>
                    <select required value={taskForm.projectId} onChange={e => setTaskForm({...taskForm, projectId: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white outline-none">
                      {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                      {projects.length === 0 && <option value="">No projects found - Create one first!</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-asana-muted">Due Date</label>
                    <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white [color-scheme:dark] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-asana-muted">Priority</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white outline-none">
                    <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                  </select>
                </div>
                <div className="mt-6 flex gap-3">
                  <button type="button" onClick={() => setIsTaskModalOpen(false)} className="w-full justify-center rounded-md border border-gray-700 py-2 bg-[#1E1E1E] text-white hover:bg-gray-800">Cancel</button>
                  <button type="submit" className="w-full justify-center rounded-md border border-transparent py-2 bg-asana-coral text-white hover:bg-opacity-90">Create Task</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
