import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Mail, CheckCircle, AlertTriangle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const res = await axiosInstance.post('/api/auth/forgotpassword', { email });
            setMessage(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
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
                        Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Recovery</span>
                    </h1>
                    <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                        Don't worry, it happens to the best of us. We'll help you get back to your research in no time.
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
                        <h2 className="text-3xl font-heading font-bold text-slate-900">Forgot Password</h2>
                        <p className="text-slate-500 mt-2">Enter your email to receive reset instructions.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm border border-green-100 flex items-center gap-2">
                                <CheckCircle size={16} />
                                {message}
                            </div>
                        )}

                        <Button className="w-full text-base py-6 shadow-lg shadow-primary/20" type="submit" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                    Sending Link...
                                </span>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </form>

                    <div className="text-center pt-4">
                        <Link to="/login" className="inline-flex items-center gap-2 font-medium text-slate-600 hover:text-primary transition-colors hover:underline">
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
