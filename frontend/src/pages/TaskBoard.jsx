import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Users, LayoutList, Trello, Info, X, MessageSquare, CheckSquare, Settings } from 'lucide-react';
import TaskCard from '../components/TaskCard'; // Needs update for dark mode if used in Board View

const TaskBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('Overview');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // Side panel state
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const [taskForm, setTaskForm] = useState({
    title: '', description: '', dueDate: '', priority: 'Medium', status: 'To Do', assignedTo: ''
  });

  const [memberEmail, setMemberEmail] = useState('');
  const [memberMessage, setMemberMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get('/api/projects'),
        api.get(`/api/tasks?projectId=${id}`)
      ]);
      const currentProject = projRes.data.find(p => p._id === id);
      if (!currentProject) throw new Error('Project not found');
      
      setProject(currentProject);
      setTasks(tasksRes.data);
    } catch (err) {
      setError('Failed to load task board');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = project?.admin?._id === user?.id;

  const handleUpdateProjectStatus = async (status) => {
    if (!isAdmin) return;
    try {
      const res = await api.patch(`/api/projects/${id}/status`, { statusTracking: status });
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Task Actions
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...taskForm, projectId: id };
      if (!payload.assignedTo) delete payload.assignedTo;
      
      const res = await api.post('/api/tasks', payload);
      setTasks([...tasks, res.data]);
      setIsTaskModalOpen(false);
      setTaskForm({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'To Do', assignedTo: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await api.patch(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
      if (selectedTask?._id === taskId) setSelectedTask(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
      if (selectedTask?._id === taskId) setSelectedTask(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  // Comments and Subtasks
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/api/tasks/${selectedTask._id}/comments`, { text: newComment });
      setTasks(tasks.map(t => t._id === selectedTask._id ? res.data : t));
      setSelectedTask(res.data);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    try {
      const res = await api.post(`/api/tasks/${selectedTask._id}/subtasks`, { title: newSubtask });
      setTasks(tasks.map(t => t._id === selectedTask._id ? res.data : t));
      setSelectedTask(res.data);
      setNewSubtask('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const res = await api.patch(`/api/tasks/${selectedTask._id}/subtasks/${subtaskId}`);
      setTasks(tasks.map(t => t._id === selectedTask._id ? res.data : t));
      setSelectedTask(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Members
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/api/projects/${id}/members`, { email: memberEmail });
      setProject(res.data.project);
      setMemberEmail('');
      setMemberMessage({ type: 'success', text: 'Member added' });
    } catch (err) {
      setMemberMessage({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  if (loading) return <div className="p-8 text-asana-muted">Loading board...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const PriorityBadge = ({ priority }) => {
    const colors = { Urgent: 'text-red-500 bg-red-500/10', High: 'text-orange-500 bg-orange-500/10', Medium: 'text-yellow-500 bg-yellow-500/10', Low: 'text-green-500 bg-green-500/10' };
    return <span className={`px-2 py-0.5 rounded text-xs ${colors[priority]}`}>{priority}</span>;
  };

  return (
    <div className="flex h-full relative">
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full transition-all ${selectedTask ? 'mr-96' : ''}`}>
        
        {/* Project Header */}
        <div className="px-6 pt-6 pb-2 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-asana-coral rounded-lg flex items-center justify-center">
                <LayoutList className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button onClick={() => setIsMemberModalOpen(true)} className="flex items-center px-3 py-1.5 rounded-md border border-gray-700 text-sm hover:bg-gray-800 transition-colors bg-[#2A2B2C]">
                  <Users className="w-4 h-4 mr-2" /> Share
                </button>
              )}
              <button className="flex items-center px-3 py-1.5 rounded-md border border-gray-700 text-sm hover:bg-gray-800 transition-colors bg-[#2A2B2C] text-white">
                <Settings className="w-4 h-4 mr-2" /> Customize
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 overflow-x-auto">
            {['Overview', 'List', 'Board', 'Timeline', 'Dashboard', 'Calendar'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab ? 'border-white text-white' : 'border-transparent text-asana-muted hover:text-gray-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'Overview' && (
            <div className="flex flex-col lg:flex-row gap-8 max-w-5xl">
              <div className="flex-1 space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">Project description</h2>
                  <p className="text-asana-muted">{project.description || "What's this project about?"}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">Project roles</h2>
                  <div className="space-y-4">
                    {project.members.map(m => (
                      <div key={m._id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E5A548] flex items-center justify-center text-[#5C3F1B] font-bold">
                          {m.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{m.name}</p>
                          <p className="text-xs text-asana-muted">{project.admin?._id === m._id ? 'Project owner' : 'Member'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-80 space-y-6">
                <div className="bg-[#2A2B2C] p-4 rounded-lg border border-gray-800">
                  <h3 className="text-white font-medium mb-3">What's the status?</h3>
                  <div className="flex gap-2">
                    {['On track', 'At risk', 'Off track'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleUpdateProjectStatus(status)}
                        disabled={!isAdmin}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          project.statusTracking === status
                            ? status === 'On track' ? 'bg-green-500/20 text-green-500 border-green-500/50' : status === 'At risk' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-red-500/20 text-red-500 border-red-500/50'
                            : 'bg-transparent text-asana-muted border-gray-700 hover:border-gray-500'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-3">Recent activity</h3>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-800 before:to-transparent">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-[#2A2B2C] text-asana-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                        <CheckSquare className="w-3 h-3" />
                      </div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-gray-800 bg-[#2A2B2C]">
                        <div className="text-white font-medium text-sm">Project created</div>
                        <div className="text-xs text-asana-muted mt-1">{new Date(project.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LIST TAB */}
          {activeTab === 'List' && (
            <div>
              <button onClick={() => setIsTaskModalOpen(true)} className="mb-4 flex items-center px-3 py-1.5 bg-asana-coral text-white rounded hover:bg-opacity-90 text-sm">
                <Plus className="w-4 h-4 mr-1" /> Add task
              </button>
              
              {['To Do', 'In Progress', 'Done'].map(status => {
                const sectionTasks = tasks.filter(t => t.status === status);
                return (
                  <div key={status} className="mb-8">
                    <h2 className="text-lg font-medium text-white mb-2 flex items-center">
                      {status} <span className="ml-2 text-xs bg-gray-800 px-2 py-0.5 rounded text-asana-muted">{sectionTasks.length}</span>
                    </h2>
                    <div className="border border-gray-800 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-[#2A2B2C]">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-asana-muted">Task name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-asana-muted">Assignee</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-asana-muted">Due date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-asana-muted">Priority</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 bg-[#1E1E1E]">
                          {sectionTasks.map(task => (
                            <tr key={task._id} onClick={() => setSelectedTask(task)} className="hover:bg-asana-hover cursor-pointer group transition-colors">
                              <td className="px-4 py-2 flex items-center text-sm text-white">
                                <CheckCircleIcon status={task.status} onClick={(e) => { e.stopPropagation(); handleUpdateTaskStatus(task._id, 'Done'); }} />
                                {task.title}
                              </td>
                              <td className="px-4 py-2 text-sm text-asana-muted">{task.assignedTo?.name || 'Unassigned'}</td>
                              <td className="px-4 py-2 text-sm text-asana-muted">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                              <td className="px-4 py-2 text-sm"><PriorityBadge priority={task.priority} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BOARD TAB */}
          {activeTab === 'Board' && (
            <div className="flex gap-6 h-full overflow-x-auto pb-4">
              {['To Do', 'In Progress', 'Done'].map(status => (
                <div key={status} className="w-80 flex flex-col bg-[#2A2B2C] rounded-xl p-4 border border-gray-800 shrink-0">
                  <h2 className="font-semibold text-white mb-4 flex justify-between items-center">
                    {status}
                    <span className="text-asana-muted text-xs">{tasks.filter(t => t.status === status).length}</span>
                  </h2>
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {tasks.filter(t => t.status === status).map(task => (
                      <div key={task._id} onClick={() => setSelectedTask(task)} className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-700 hover:border-gray-500 cursor-pointer shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <PriorityBadge priority={task.priority} />
                        </div>
                        <h3 className="text-white text-sm font-medium mb-2">{task.title}</h3>
                        <div className="flex items-center justify-between text-xs text-asana-muted">
                          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</span>
                          {task.assignedTo && <div className="w-6 h-6 rounded-full bg-[#E5A548] text-[#5C3F1B] flex items-center justify-center font-bold">{task.assignedTo.name.substring(0, 2).toUpperCase()}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* OTHER TABS (Timeline, Dashboard, Calendar) */}
          {['Timeline', 'Dashboard', 'Calendar'].includes(activeTab) && (
            <div className="py-12 flex flex-col items-center justify-center text-asana-muted border border-dashed border-gray-800 rounded-lg h-full">
              <h3 className="text-lg font-medium text-white mb-2">{activeTab} View</h3>
              <p>This premium view is ready to be implemented.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sliding Right Panel for Task Details */}
      {selectedTask && (
        <div className="w-96 bg-[#2A2B2C] border-l border-gray-800 fixed right-0 top-14 bottom-0 flex flex-col shadow-2xl z-10 transition-transform transform translate-x-0 overflow-y-auto">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#222324]">
            <button onClick={() => handleUpdateTaskStatus(selectedTask._id, selectedTask.status === 'Done' ? 'To Do' : 'Done')} className={`px-3 py-1.5 rounded flex items-center text-sm font-medium ${selectedTask.status === 'Done' ? 'bg-green-500/20 text-green-500' : 'border border-gray-600 text-white hover:bg-gray-700'}`}>
              <CheckSquare className="w-4 h-4 mr-2" /> {selectedTask.status === 'Done' ? 'Completed' : 'Mark complete'}
            </button>
            <div className="flex items-center gap-2">
              {(isAdmin || selectedTask.assignedTo?._id === user?.id) && (
                <button onClick={() => handleDeleteTask(selectedTask._id)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded">Delete</button>
              )}
              <button onClick={() => setSelectedTask(null)} className="text-asana-muted hover:text-white p-1.5 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 flex-1 space-y-6">
            <h2 className="text-xl font-bold text-white">{selectedTask.title}</h2>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-asana-muted">Assignee</div>
              <div className="col-span-2 text-white flex items-center">
                {selectedTask.assignedTo ? selectedTask.assignedTo.name : 'Unassigned'}
              </div>
              
              <div className="text-asana-muted">Due date</div>
              <div className="col-span-2 text-white">
                {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'No due date'}
              </div>

              <div className="text-asana-muted">Priority</div>
              <div className="col-span-2"><PriorityBadge priority={selectedTask.priority} /></div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Description</h3>
              <p className="text-asana-muted text-sm bg-[#1E1E1E] p-3 rounded border border-gray-800">{selectedTask.description || 'No description provided.'}</p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Subtasks</h3>
              <div className="space-y-2 mb-3">
                {selectedTask.subtasks?.map(st => (
                  <div key={st._id} className="flex items-center gap-3 group">
                    <button onClick={() => handleToggleSubtask(st._id)} className={`w-5 h-5 rounded-full border flex items-center justify-center ${st.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-500 group-hover:border-green-500'}`}>
                      {st.completed && <CheckSquare className="w-3 h-3" />}
                    </button>
                    <span className={`text-sm ${st.completed ? 'text-gray-500 line-through' : 'text-white'}`}>{st.title}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <input type="text" value={newSubtask} onChange={e => setNewSubtask(e.target.value)} placeholder="Add a subtask..." className="flex-1 bg-[#1E1E1E] border border-gray-700 text-white text-sm rounded px-3 py-1.5 focus:border-asana-coral outline-none" />
              </form>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-white font-medium mb-4 flex items-center"><MessageSquare className="w-4 h-4 mr-2" /> Comments</h3>
              <div className="space-y-4 mb-4">
                {selectedTask.comments?.map(c => (
                  <div key={c._id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white font-bold">{c.user?.name?.substring(0,2).toUpperCase()}</div>
                    <div className="flex-1 bg-[#1E1E1E] p-3 rounded-lg border border-gray-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">{c.user?.name}</span>
                        <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-300">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Ask a question or post an update..." className="flex-1 bg-[#1E1E1E] border border-gray-700 text-white text-sm rounded px-3 py-2 focus:border-asana-coral outline-none" />
                <button type="submit" className="bg-gray-700 hover:bg-gray-600 text-white px-3 rounded text-sm transition-colors">Comment</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={() => setIsTaskModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-[#2A2B2C] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-gray-800">
              <h3 className="text-lg leading-6 font-medium text-white mb-4">Create New Task</h3>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-asana-muted">Title</label>
                  <input type="text" required value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-asana-coral sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-asana-muted">Description</label>
                  <textarea rows="2" value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-asana-coral sm:text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-asana-muted">Due Date</label>
                    <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-asana-coral sm:text-sm [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-asana-muted">Priority</label>
                    <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-asana-coral sm:text-sm">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-asana-muted">Assign To</label>
                  <select value={taskForm.assignedTo} onChange={e => setTaskForm({...taskForm, assignedTo: e.target.value})} className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-asana-coral sm:text-sm">
                    <option value="">Unassigned</option>
                    {project.members.map(m => (
                      <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                    ))}
                  </select>
                </div>
                <div className="mt-5 sm:mt-6 flex gap-3">
                  <button type="button" onClick={() => setIsTaskModalOpen(false)} className="w-full justify-center rounded-md border border-gray-700 py-2 bg-[#1E1E1E] text-white hover:bg-gray-800">Cancel</button>
                  <button type="submit" className="w-full justify-center rounded-md border border-transparent py-2 bg-asana-coral text-white hover:bg-opacity-90">Create Task</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-75" onClick={() => setIsMemberModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-[#2A2B2C] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-gray-800">
              <h3 className="text-lg leading-6 font-medium text-white mb-4">Manage Team Members</h3>
              <form onSubmit={handleAddMember} className="mb-6 flex gap-2">
                <input type="email" placeholder="User email address" required value={memberEmail} onChange={e => setMemberEmail(e.target.value)} className="flex-1 bg-[#1E1E1E] border border-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-asana-coral sm:text-sm" />
                <button type="submit" className="justify-center rounded-md py-2 px-4 bg-asana-coral text-sm font-medium text-white hover:bg-opacity-90">Add</button>
              </form>
              <div className="mt-6">
                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="w-full justify-center rounded-md border border-gray-700 py-2 bg-[#1E1E1E] text-white hover:bg-gray-800 sm:text-sm">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mini check circle icon for List view
const CheckCircleIcon = ({ status, onClick }) => {
  if (status === 'Done') return <div onClick={onClick} className="w-5 h-5 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center mr-3 hover:bg-green-600 transition-colors"><CheckSquare className="w-3 h-3 text-white" /></div>;
  return <div onClick={onClick} className="w-5 h-5 rounded-full border-2 border-gray-500 mr-3 hover:border-green-500 transition-colors"></div>;
}

export default TaskBoard;
