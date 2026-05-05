import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Filter, Search, Plus, MoreHorizontal, CheckSquare, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('List');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [inlineCreateGroup, setInlineCreateGroup] = useState(null);
  const [inlineTaskTitle, setInlineTaskTitle] = useState('');
  const [projects, setProjects] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', dueDate: '', priority: 'Medium' });
  const [showToast, setShowToast] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({
    'To do': true,
    'In progress': true,
    'Done': true
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  // Badge Components
  const PriorityBadge = ({ priority }) => {
    if (!priority) return null;
    const colors = { Urgent: 'text-red-900 bg-red-400', High: 'text-red-900 bg-red-400', Medium: 'text-orange-900 bg-orange-400', Low: 'text-yellow-900 bg-yellow-400' };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[priority] || 'bg-gray-700 text-white'}`}>{priority}</span>;
  };

  const EffortBadge = ({ effort }) => {
    if (!effort) return null;
    const colors = { Small: 'text-green-900 bg-[#A3E08C]', Medium: 'text-green-900 bg-[#65D075]', Large: 'text-blue-900 bg-[#72C3FA]' };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[effort] || 'bg-gray-700 text-white'}`}>{effort}</span>;
  };

  const CategoryBadge = ({ category }) => {
    if (!category || category === 'Other') return null;
    const colors = { Health: 'text-pink-900 bg-[#F4A8CA]', Finance: 'text-blue-900 bg-[#8DA3FA]', Home: 'text-green-900 bg-[#8CE0A5]', Errands: 'text-purple-900 bg-[#D7A8F4]', Work: 'text-yellow-900 bg-[#F4D7A8]' };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[category] || 'bg-gray-700 text-white'}`}>{category}</span>;
  };

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const res = await api.get('/api/tasks/my');
        setTasks(res.data);
      } catch (err) {
        console.error('Failed to load tasks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTasks();
    
    api.get('/api/projects').then(res => {
      setProjects(res.data);
    }).catch(console.error);
  }, []);

  if (loading) return <div className="p-8 text-asana-muted">Loading My Tasks...</div>;

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await api.patch(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/tasks', { ...taskForm });
      setTasks([...tasks, res.data]);
      setIsTaskModalOpen(false);
      setTaskForm({ title: '', dueDate: '', priority: 'Medium' });
      setShowToast('Task created successfully');
      setTimeout(() => setShowToast(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleInlineCreate = async (e, statusGroup) => {
    if (e.key === 'Enter' && inlineTaskTitle.trim()) {
      try {
        const payload = {
          title: inlineTaskTitle,
          status: statusGroup,
          dueDate: '',
          priority: 'Medium',
          effort: 'Medium',
          category: 'Other'
        };
        const res = await api.post('/api/tasks', payload);
        setTasks([...tasks, res.data]);
        setInlineTaskTitle(''); // keep input open
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to create task');
      }
    }
  };

  const handleFeatureSoon = (feature) => {
    setShowToast(`${feature} feature coming soon!`);
    setTimeout(() => setShowToast(''), 3000);
  };

  const toggleGroup = (title) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  // Groups
  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  // Calendar Logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[100px] border border-gray-800 bg-[#1A1A1A]"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.dueDate && t.dueDate.startsWith(dateStr));
      
      days.push(
        <div key={`day-${i}`} className="min-h-[120px] p-2 border border-gray-800 bg-[#1E1E1E] hover:bg-[#2A2B2C] transition-colors">
           <span className="text-xs font-bold text-gray-500 mb-2 block">{i}</span>
           <div className="space-y-1">
             {dayTasks.map(t => (
               <div key={t._id} className="text-[10px] px-1.5 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 truncate cursor-pointer hover:bg-blue-500/30 transition-colors">
                 {t.title}
               </div>
             ))}
           </div>
        </div>
      );
    }
    return days;
  };

  const renderTaskGroup = (title, groupTasks) => (
    <div key={title} className="mb-4">
      <h3 onClick={() => toggleGroup(title)} className="text-sm font-medium text-white mb-2 flex items-center group cursor-pointer w-max hover:bg-gray-800 px-2 py-1 rounded transition-colors -ml-2">
        <ChevronDown className={`w-4 h-4 mr-2 text-asana-muted group-hover:text-white transition-transform ${expandedGroups[title] ? '' : '-rotate-90'}`} />
        {title}
      </h3>
      {expandedGroups[title] && (
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-800">
            <tbody className="divide-y divide-gray-800">
              {groupTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" onClick={() => setIsTaskModalOpen(true)} className="px-4 py-2 text-sm text-asana-muted hover:bg-asana-hover cursor-pointer pl-10 transition-colors">
                    Add task...
                  </td>
                </tr>
              ) : (
                groupTasks.map(task => (
                  <tr key={task._id} className="hover:bg-[#2A2B2C] group transition-colors">
                    <td className="px-4 py-2 flex items-center text-sm text-white min-w-[300px]">
                      {task.status === 'Done' ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3 cursor-pointer hover:bg-green-600 transition-colors" onClick={(e) => { e.stopPropagation(); handleUpdateTaskStatus(task._id, 'To Do'); }}>
                          <CheckSquare className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-500 mr-3 cursor-pointer hover:border-green-500 hover:bg-green-500/10 transition-colors flex items-center justify-center group-hover:border-white" onClick={(e) => { e.stopPropagation(); handleUpdateTaskStatus(task._id, 'Done'); }}>
                          <CheckSquare className="w-3 h-3 text-transparent group-hover:text-gray-500 hover:!text-green-500" />
                        </div>
                      )}
                      <span className="truncate">{task.title}</span>
                    </td>
                    <td className="px-4 py-2 text-sm text-asana-muted whitespace-nowrap w-40 border-l border-gray-800">
                      {task.assignedTo && task.assignedTo.name ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-[#E5A548] text-[#5C3F1B] flex items-center justify-center font-bold text-[10px] mr-2 shrink-0">
                            {task.assignedTo.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="truncate">{task.assignedTo.name}</span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-dashed border-gray-500 flex items-center justify-center hover:border-white cursor-pointer transition-colors">
                          <span className="text-gray-500 text-[10px]">+</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-asana-muted border-l border-gray-800 w-32 cursor-text hover:bg-[#2A2B2C]">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                    </td>
                    <td className="px-4 py-2 text-sm border-l border-gray-800 w-32">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-4 py-2 text-sm border-l border-gray-800 w-32">
                      <EffortBadge effort={task.effort} />
                    </td>
                    <td className="px-4 py-2 text-sm border-l border-gray-800 w-32">
                      <CategoryBadge category={task.category} />
                    </td>
                    <td className="px-4 py-2 text-sm text-asana-muted border-l border-gray-800 w-10 text-center hover:bg-gray-700 hover:text-white transition-colors cursor-pointer">+</td>
                  </tr>
                ))
              )}
              {/* Inline Add Task Row */}
              <tr className={`hover:bg-[#2A2B2C] transition-colors ${inlineCreateGroup === title ? 'bg-[#1E1E1E] border-y border-blue-500 shadow-inner' : ''}`}>
                <td colSpan={groupTasks.length === 0 ? 7 : 1} className="px-4 py-2 flex items-center text-sm min-w-[300px]">
                  <div className="w-5 h-5 rounded-full border border-transparent mr-3 shrink-0"></div>
                  {inlineCreateGroup === title ? (
                    <input
                      type="text"
                      autoFocus
                      placeholder="Write a task name"
                      value={inlineTaskTitle}
                      onChange={(e) => setInlineTaskTitle(e.target.value)}
                      onKeyDown={(e) => handleInlineCreate(e, title)}
                      onBlur={() => { if (!inlineTaskTitle.trim()) setInlineCreateGroup(null); }}
                      className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-gray-500"
                    />
                  ) : (
                    <span onClick={() => { setInlineCreateGroup(title); setInlineTaskTitle(''); }} className="text-asana-muted cursor-pointer hover:text-white">Add task...</span>
                  )}
                </td>
                {groupTasks.length > 0 && (
                  <>
                    <td className="border-l border-gray-800"></td>
                    <td className="border-l border-gray-800"></td>
                    <td className="border-l border-gray-800"></td>
                    <td className="border-l border-gray-800"></td>
                    <td className="border-l border-gray-800"></td>
                    <td className="border-l border-gray-800"></td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-asana-dark text-white overflow-hidden">
      
      {/* Header */}
      <div className="px-6 pt-6 pb-2 border-b border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E5A548] text-[#5C3F1B] flex items-center justify-center font-bold text-xs">MK</div>
            <h1 className="text-2xl font-bold">My tasks</h1>
            <ChevronDown className="w-4 h-4 text-asana-muted cursor-pointer" />
          </div>
          <div className="flex gap-2">
             <button onClick={() => handleFeatureSoon('Share')} className="px-3 py-1.5 rounded-md border border-gray-700 text-sm hover:bg-gray-800 transition-colors bg-[#2A2B2C]">Share</button>
             <button onClick={() => handleFeatureSoon('Customize')} className="px-3 py-1.5 rounded-md border border-gray-700 text-sm hover:bg-gray-800 transition-colors bg-[#2A2B2C]">Customize</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6">
          {['List', 'Board', 'Calendar', 'Dashboard', 'Files'].map(tab => (
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
        <div className="flex items-center gap-2">
           <div className="flex rounded-md overflow-hidden bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors">
             <button onClick={() => setIsTaskModalOpen(true)} className="px-3 py-1.5 flex items-center border-r border-blue-500"><Plus className="w-4 h-4 mr-1.5" /> Add task</button>
             <button onClick={() => setIsTaskModalOpen(true)} className="px-2 py-1.5"><ChevronDown className="w-4 h-4"/></button>
           </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-asana-muted">
          <button onClick={() => handleFeatureSoon('Filter')} className="flex items-center hover:text-white transition-colors">
            <Filter className="w-3.5 h-3.5 mr-1.5" /> Filter
          </button>
          <button onClick={() => handleFeatureSoon('Sort')} className="flex items-center hover:text-white transition-colors">
            <span className="w-3.5 h-3.5 mr-1.5 font-bold">↑↓</span> Sort
          </button>
          <button onClick={() => handleFeatureSoon('Group')} className="flex items-center hover:text-white transition-colors">
            <span className="w-3.5 h-3.5 mr-1.5 font-bold">≡</span> Group
          </button>
          <button onClick={() => handleFeatureSoon('Options')} className="flex items-center hover:text-white transition-colors ml-4 border-l border-gray-700 pl-4">
            Options
          </button>
          <button onClick={() => handleFeatureSoon('Search')} className="hover:text-white"><Search className="w-4 h-4"/></button>
        </div>
      </div>

      {activeTab === 'List' && (
        <div className="px-6 py-2 border-b border-gray-800 flex text-xs font-medium text-asana-muted bg-[#222324] uppercase tracking-wider">
           <div className="flex-1 px-4 min-w-[300px]">Name</div>
           <div className="w-40 px-4 border-l border-gray-800">Assignee</div>
           <div className="w-32 px-4 border-l border-gray-800">Due date</div>
           <div className="w-32 px-4 border-l border-gray-800">Priority</div>
           <div className="w-32 px-4 border-l border-gray-800">Effort</div>
           <div className="w-32 px-4 border-l border-gray-800">Category</div>
           <div className="w-10 px-4 border-l border-gray-800 text-center cursor-pointer hover:text-white">+</div>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto max-w-full ${activeTab === 'List' ? 'px-6 py-4 bg-[#1E1E1E]' : 'p-6 bg-[#1E1E1E]'}`}>
        {activeTab === 'List' && (
          <div>
            {renderTaskGroup("To do", todoTasks)}
            {renderTaskGroup("In progress", inProgressTasks)}
            {renderTaskGroup("Done", doneTasks)}
            
            <button className="mt-4 flex items-center text-sm text-white hover:text-asana-coral group">
               <div className="w-5 h-5 rounded hover:bg-gray-800 flex items-center justify-center mr-2"><Plus className="w-4 h-4"/></div>
               Add section
            </button>
          </div>
        )}
        
        {/* BOARD TAB */}
        {activeTab === 'Board' && (
          <div className="flex gap-6 h-full overflow-x-auto pb-4">
            {[
              { title: 'To Do', items: todoTasks },
              { title: 'In Progress', items: inProgressTasks },
              { title: 'Done', items: doneTasks }
            ].map(status => (
              <div key={status.title} className="w-80 flex flex-col bg-[#2A2B2C] rounded-xl p-4 border border-gray-800 shrink-0 h-max max-h-full">
                <h2 className="font-semibold text-white mb-4 flex justify-between items-center">
                  {status.title}
                  <span className="text-asana-muted text-xs bg-gray-800 px-2 py-0.5 rounded">{status.items.length}</span>
                </h2>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2">
                  {status.items.map(task => (
                    <div key={task._id} className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-700 hover:border-gray-500 cursor-pointer shadow-sm group transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <PriorityBadge priority={task.priority} />
                        {task.status === 'Done' ? (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors" onClick={(e) => { e.stopPropagation(); handleUpdateTaskStatus(task._id, 'To Do'); }}>
                            <CheckSquare className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-gray-500 cursor-pointer hover:border-green-500 hover:bg-green-500/10 transition-colors flex items-center justify-center group-hover:border-white" onClick={(e) => { e.stopPropagation(); handleUpdateTaskStatus(task._id, 'Done'); }}>
                            <CheckSquare className="w-3 h-3 text-transparent group-hover:text-gray-500 hover:!text-green-500" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-white text-sm font-medium mb-3">{task.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <EffortBadge effort={task.effort} />
                        <CategoryBadge category={task.category} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-asana-muted pt-2 border-t border-gray-800">
                        <span className="flex items-center">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}</span>
                        {task.assignedTo && task.assignedTo.name && <div className="w-6 h-6 rounded-full bg-[#E5A548] text-[#5C3F1B] flex items-center justify-center font-bold text-[10px]">{task.assignedTo.name.substring(0, 2).toUpperCase()}</div>}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setIsTaskModalOpen(true)} className="w-full text-left mt-2 py-2 text-sm text-asana-muted hover:text-white transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> Add task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'Calendar' && (
          <div className="h-full flex flex-col bg-[#2A2B2C] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#222324]">
              <h2 className="text-lg font-bold text-white">
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-1.5 rounded bg-[#1E1E1E] border border-gray-700 hover:bg-gray-800 text-white transition-colors"><ChevronLeft className="w-5 h-5"/></button>
                <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 rounded bg-[#1E1E1E] border border-gray-700 hover:bg-gray-800 text-white text-sm font-medium transition-colors">Today</button>
                <button onClick={nextMonth} className="p-1.5 rounded bg-[#1E1E1E] border border-gray-700 hover:bg-gray-800 text-white transition-colors"><ChevronRight className="w-5 h-5"/></button>
              </div>
            </div>
            <div className="grid grid-cols-7 border-b border-gray-800 bg-[#1E1E1E]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="p-2 text-center text-xs font-medium text-asana-muted uppercase tracking-wider">{d}</div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-7 auto-rows-fr">
              {renderCalendar()}
            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'Dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
             {/* Summary Widget */}
             <div className="bg-[#2A2B2C] border border-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-white mb-6">Task Progress</h3>
                <div className="flex items-center justify-around">
                   <div className="text-center">
                     <div className="text-5xl font-light text-white mb-2">{doneTasks.length}</div>
                     <div className="text-xs text-asana-muted font-medium uppercase tracking-wider">Completed</div>
                   </div>
                   <div className="text-center">
                     <div className="text-5xl font-light text-white mb-2">{tasks.length - doneTasks.length}</div>
                     <div className="text-xs text-asana-muted font-medium uppercase tracking-wider">Incomplete</div>
                   </div>
                </div>
             </div>

             {/* Priority Breakdown */}
             <div className="bg-[#2A2B2C] border border-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-white mb-6">Tasks by Priority</h3>
                <div className="space-y-5">
                   {['Urgent', 'High', 'Medium', 'Low'].map(p => {
                     const count = tasks.filter(t => t.priority === p).length;
                     const percent = tasks.length ? (count / tasks.length) * 100 : 0;
                     return (
                       <div key={p} className="flex items-center text-sm group">
                         <div className="w-20 text-asana-muted font-medium group-hover:text-white transition-colors">{p}</div>
                         <div className="flex-1 bg-[#1E1E1E] h-4 rounded-full overflow-hidden mx-4 shadow-inner border border-gray-800">
                           <div className={`h-full ${p==='Urgent'?'bg-red-500':p==='High'?'bg-orange-500':p==='Medium'?'bg-yellow-500':'bg-green-500'} transition-all duration-1000 ease-out`} style={{width: `${percent}%`}}></div>
                         </div>
                         <div className="w-8 text-right text-white font-medium">{count}</div>
                       </div>
                     )
                   })}
                </div>
             </div>

             {/* Recent Tasks */}
             <div className="bg-[#2A2B2C] border border-gray-800 rounded-xl p-6 shadow-sm md:col-span-2">
                <h3 className="text-lg font-bold text-white mb-6">Recently Added Tasks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.slice().reverse().slice(0, 6).map(t => (
                    <div key={t._id} className="bg-[#1E1E1E] border border-gray-800 p-4 rounded-lg flex items-start gap-3 hover:border-gray-600 transition-colors cursor-pointer group">
                       <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                         <CheckSquare className="w-4 h-4"/>
                       </div>
                       <div className="overflow-hidden flex-1">
                         <div className="text-sm text-white font-medium truncate mb-1">{t.title}</div>
                         <div className="flex gap-2">
                            <PriorityBadge priority={t.priority} />
                            <EffortBadge effort={t.effort} />
                         </div>
                       </div>
                    </div>
                  ))}
                  {tasks.length === 0 && <div className="text-asana-muted text-sm col-span-full">No tasks found.</div>}
                </div>
             </div>
          </div>
        )}

        {/* FILES TAB */}
        {activeTab === 'Files' && (
          <div className="py-12 flex flex-col items-center justify-center text-asana-muted border border-dashed border-gray-800 rounded-lg">
             <h3 className="text-lg font-medium text-white mb-2">Files View</h3>
             <p>This premium view is ready to be implemented.</p>
          </div>
        )}
      </div>

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-[#2A2B2C] text-white px-4 py-3 rounded-lg shadow-lg border border-gray-700 flex items-center z-50 animate-fade-in-up">
          <CheckSquare className="w-5 h-5 text-green-500 mr-3" />
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
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-asana-muted">Due Date</label>
                    <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white [color-scheme:dark] outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-asana-muted">Priority</label>
                    <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white outline-none">
                      <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-asana-muted">Effort</label>
                    <select value={taskForm.effort} onChange={e => setTaskForm({...taskForm, effort: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white outline-none">
                      <option>Small</option><option>Medium</option><option>Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-asana-muted">Category</label>
                    <select value={taskForm.category} onChange={e => setTaskForm({...taskForm, category: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white outline-none">
                      <option>Health</option><option>Finance</option><option>Home</option><option>Errands</option><option>Work</option><option>Other</option>
                    </select>
                  </div>
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

export default MyTasks;
