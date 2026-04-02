import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { BookOpen, ArrowRight, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/login', {
        email,
        password
      });

      login(res.data.user, res.data.token);

      // Redirect based on role
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'reviewer') navigate('/reviewer');
      else navigate('/author');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Hero/Visual Side */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <BookOpen size={24} className="text-primary-foreground" />
            <span className="text-xl font-bold font-heading tracking-tight">ScholarConnect</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-heading font-bold mb-6 leading-tight">
            Publish your research with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Application</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Join a global community of researchers and innovators. manage your submissions, review papers, and contribute to the advancement of knowledge.
          </p>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} ScholarConnect. All rights reserved.
        </div>
      </div>

      {/* Right: Form Side */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-[420px] space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="bg-primary text-white p-2 rounded-lg">
                <BookOpen size={24} />
              </div>
            </div>
            <h2 className="text-3xl font-heading font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                {error}
              </div>
            )}

            <Button className="w-full text-base py-6 shadow-lg shadow-primary/20" type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-500">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
              <span className="font-medium text-slate-700">Reviewer?</span>
              <Link to="/register" className="block text-primary font-semibold mt-1">Register Here</Link>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
              <span className="font-medium text-slate-700">Author?</span>
              <Link to="/submit-paper" className="block text-primary font-semibold mt-1">Submit Paper</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
