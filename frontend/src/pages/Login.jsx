import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/auth/login', formData);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E2E] flex">
      {/* Left side - Decorative Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2A2B2C] relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-asana-coral/20 to-transparent"></div>
        <div className="relative z-10 p-12 text-center max-w-lg">
           <div className="w-24 h-24 bg-asana-coral rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-12">
             <div className="w-12 h-12 bg-white rounded-full opacity-20"></div>
           </div>
           <h2 className="text-4xl font-bold text-white mb-4">Manage your work, seamlessly.</h2>
           <p className="text-asana-muted text-lg">Join millions of teams worldwide using Asana to do more, together.</p>
        </div>
        {/* Abstract circles */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-asana-coral/10 rounded-full blur-2xl"></div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-asana-dark text-white relative">
        <div className="max-w-md w-full">
          <div className="mb-10 text-center lg:text-left">
             <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
             <p className="text-asana-muted">Log in to your workspace</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-2 rounded">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-[#1E1E1E] border border-gray-700 rounded-md text-white focus:outline-none focus:border-asana-coral focus:ring-1 focus:ring-asana-coral transition-colors"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input 
                type="password" 
                required 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 bg-[#1E1E1E] border border-gray-700 rounded-md text-white focus:outline-none focus:border-asana-coral focus:ring-1 focus:ring-asana-coral transition-colors"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-asana-muted">
                <input type="checkbox" className="mr-2 rounded border-gray-700 bg-[#1E1E1E]" />
                Remember me
              </label>
              <a href="#" className="text-asana-coral hover:underline">Forgot password?</a>
            </div>
            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-asana-coral hover:bg-opacity-90 text-white rounded-md font-medium transition-colors shadow-lg shadow-asana-coral/20"
            >
              Log In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-asana-muted">
            Don't have an account? <Link to="/signup" className="text-asana-coral font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
