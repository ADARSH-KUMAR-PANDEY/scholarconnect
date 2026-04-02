import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { BookOpen, ArrowRight, Mail, Lock, User, GraduationCap, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    qualifications: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axiosInstance.post('/api/auth/register-reviewer', formData);
      setSuccess('Registration successful! Please wait for admin approval.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
            Join our expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Reviewer Panel</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed mb-8">
            Contribute to the scientific community by reviewing cutting-edge research. Ensure quality, integrity, and innovation in every publication.
          </p>
          <ul className="space-y-4 text-zinc-300">
            <li className="flex items-center gap-3">
              <CheckCircle size={20} className="text-emerald-500" />
              <span>Access latest research in your field</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle size={20} className="text-emerald-500" />
              <span>Build your professional reputation</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle size={20} className="text-emerald-500" />
              <span>Certificate of Reviewing</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} ScholarConnect. All rights reserved.
        </div>
      </div>

      {/* Right: Form Side */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-[480px] space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="bg-primary text-white p-2 rounded-lg">
                <BookOpen size={24} />
              </div>
            </div>
            <h2 className="text-3xl font-heading font-bold text-slate-900">Create Account</h2>
            <p className="text-slate-500 mt-2">Become a reviewer for ScholarConnect.</p>
          </div>

          {success ? (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Registration Successful!</h3>
              <p className="text-slate-600">Your application has been submitted. Please wait for admin approval before logging in.</p>
              <Button className="w-full mt-4" onClick={() => navigate('/login')}>
                Acccepted? Login Now
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    placeholder="Dr. John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    placeholder="name@university.edu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications & Expertise</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 text-slate-400" size={18} />
                  <Input
                    id="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    placeholder="PhD in CS, Machine Learning Expert..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
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
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Register as Reviewer <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </form>
          )}

          {!success && (
            <div className="text-center pt-4">
              <span className="text-slate-500">Already have an account? </span>
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Login here
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
