import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Users, ArrowRight, Plus } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/api/projects', { name, description });
      setProjects([...projects, res.data]);
      setIsModalOpen(false);
      setName('');
      setDescription('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-asana-muted">Loading projects...</div>;

  const StatusBadge = ({ status }) => {
    if (!status) return null;
    const colors = {
      'On track': 'bg-green-500/20 text-green-500',
      'At risk': 'bg-yellow-500/20 text-yellow-500',
      'Off track': 'bg-red-500/20 text-red-500'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors['On track']}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-asana-coral hover:bg-opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </button>
      </div>

      {error && <div className="bg-red-900/20 text-red-500 p-4 rounded-md mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-[#2A2B2C] rounded-lg border border-gray-800 border-dashed">
            <h3 className="text-lg font-medium text-white">No projects yet</h3>
            <p className="mt-1 text-sm text-asana-muted">Get started by creating a new project.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="bg-[#2A2B2C] overflow-hidden rounded-lg border border-gray-800 hover:border-gray-600 transition-colors flex flex-col h-full">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-[#333435] flex items-center justify-center">
                      <Briefcase className="text-asana-muted w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white line-clamp-1" title={project.name}>{project.name}</h3>
                      <StatusBadge status={project.statusTracking || 'On track'} />
                    </div>
                  </div>
                </div>
                
                <p className="mt-4 text-sm text-asana-muted line-clamp-2" title={project.description}>
                  {project.description || 'No description provided.'}
                </p>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center text-sm text-asana-muted">
                    <Users className="w-4 h-4 mr-1.5" />
                    {project.members?.length || 0} Members
                  </div>
                  {project.admin?._id === user?.id && (
                    <span className="text-xs text-[#E5A548]">Owner</span>
                  )}
                </div>
              </div>

              <div className="bg-[#222324] px-6 py-4 border-t border-gray-800 flex justify-between items-center mt-auto">
                <span className="text-xs text-asana-muted">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/projects/${project._id}`}
                  className="text-sm font-medium text-asana-coral hover:text-white flex items-center transition-colors"
                >
                  Go to Project <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-[#2A2B2C] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-gray-800">
              <div>
                <h3 className="text-lg leading-6 font-medium text-white">Create New Project</h3>
                <div className="mt-4">
                  <form onSubmit={handleCreateProject}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-asana-muted">Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-asana-coral sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-asana-muted">Description</label>
                        <textarea
                          rows="3"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="mt-1 block w-full bg-[#1E1E1E] border border-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-asana-coral sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-[#1E1E1E] text-base font-medium text-white hover:bg-gray-800 focus:outline-none sm:text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-asana-coral text-base font-medium text-white hover:bg-opacity-90 focus:outline-none sm:text-sm disabled:opacity-50"
                      >
                        {isSubmitting ? 'Creating...' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
