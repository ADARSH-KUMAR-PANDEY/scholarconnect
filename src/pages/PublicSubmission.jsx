import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Label } from '../components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../components/ui/dialog"
import { UploadCloud, FileText, User, Mail, CheckCircle, AlertCircle, ArrowLeft, Send } from 'lucide-react';

const PublicSubmission = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [abstract, setAbstract] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
            } else {
                setMessage("Only PDF files are allowed.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please upload a PDF manuscript.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('abstract', abstract);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('file', file);

        setLoading(true);
        setMessage('');

        try {
            await axiosInstance.post('/api/papers/submit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowSuccessDialog(true);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        if (user) {
            user.role === 'admin' ? navigate('/admin') :
                user.role === 'reviewer' ? navigate('/reviewer') : navigate('/author');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 z-0 opacity-100"></div>
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-4xl z-10">
                <div className="mb-6 flex items-center justify-between text-white">
                    <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                        <ArrowLeft size={20} /> Back to Home
                    </Link>
                    <div className="flex items-center gap-2 font-semibold">
                        <FileText className="text-blue-400" /> ScholarConnect Submission
                    </div>
                </div>

                <div className="flex justify-center">
                    {/* Submission Form */}
                    <Card className="w-full max-w-2xl shadow-2xl border-0 ring-1 ring-slate-200 bg-white/95 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-slate-900">Manuscript Details</CardTitle>
                            <CardDescription>Enter the details of your research paper below.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name" className="flex items-center gap-2">
                                            <User size={14} className="text-slate-400" /> Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            disabled={!!user}
                                            placeholder="Dr. Jane Smith"
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="flex items-center gap-2">
                                            <Mail size={14} className="text-slate-400" /> Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={!!user}
                                            placeholder="jane.smith@uni.edu"
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="title" className="flex items-center gap-2">
                                        <FileText size={14} className="text-slate-400" /> Paper Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        placeholder="E.g. The Impact of AI on Modern Education"
                                        className="bg-slate-50 border-slate-200 font-medium"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="abstract">Abstract</Label>
                                    <textarea
                                        id="abstract"
                                        className="flex min-h-[100px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus:bg-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors resize-none"
                                        value={abstract}
                                        onChange={(e) => setAbstract(e.target.value)}
                                        required
                                        placeholder="Summarize your research objectives and findings..."
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="file">Upload Manuscript (PDF)</Label>
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-6 transition-all text-center cursor-pointer relative ${dragActive
                                                ? 'border-primary bg-primary/5 text-primary scale-[1.01]'
                                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <Input
                                            id="file"
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                                            {file ? (
                                                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-red-100 rounded flex items-center justify-center text-red-600">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-medium text-slate-900 truncate max-w-[180px]">{file.name}</p>
                                                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={(e) => { e.preventDefault(); setFile(null); }}>
                                                        <AlertCircle size={16} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-1">
                                                        <UploadCloud className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                                                    <p className="text-xs text-slate-400">PDF documents only (Max 10MB)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {message && (
                                    <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-600 text-sm animate-in fade-in slide-in-from-top-1 border border-red-100">
                                        <AlertCircle className="h-4 w-4" />
                                        {message}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Send size={16} /> Submit Research Paper
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={showSuccessDialog} onOpenChange={(open) => {
                if (!open) handleSuccessClose();
                setShowSuccessDialog(open);
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4 animate-in zoom-in duration-300">
                            <CheckCircle className="h-8 w-8 text-emerald-600" />
                        </div>
                        <DialogTitle className="text-center text-xl text-emerald-800">Submission Received!</DialogTitle>
                        <DialogDescription className="text-center pt-2 space-y-3">
                            <p className="text-slate-600">Your paper has been securely submitted. Our editorial team will begin the review process shortly.</p>

                            {!user && (
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-left mt-4 text-slate-700 text-sm shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900">
                                        <User size={16} /> Account Created
                                    </div>
                                    <p className="mb-1">We've created an account for you to track your submission:</p>
                                    <div className="bg-white px-3 py-2 rounded border border-slate-200 font-mono text-slate-800 mb-2">
                                        {email}
                                    </div>
                                    <p className="text-xs text-slate-500">Please check your email for your temporary password.</p>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center">
                        <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" onClick={handleSuccessClose}>
                            {user ? 'Return to Dashboard' : 'Login to Dashboard'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PublicSubmission;
