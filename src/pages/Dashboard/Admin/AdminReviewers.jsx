import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { CheckCircle, Mail, Search, ShieldCheck, Trash2, User, Calendar, BookOpen, Award } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

const AdminReviewers = () => {
    const [reviewers, setReviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReviewer, setSelectedReviewer] = useState(null);

    useEffect(() => {
        const fetchReviewers = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get('/api/users/reviewers');
                setReviewers(res.data);
            } catch (error) {
                console.error("Error fetching reviewers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviewers();
    }, []);

    const handleDelete = async (userId, name) => {
        if (!window.confirm(`Are you sure you want to remove ${name} from the system? This action cannot be undone.`)) {
            return;
        }

        try {
            await axiosInstance.delete(`/api/users/${userId}`);
            setReviewers(reviewers.filter(r => r._id !== userId));
            // Show success toast if available, or just log
            console.log("User deleted");
        } catch (error) {
            console.error("Error deleting user", error);
            alert("Failed to delete user: " + (error.response?.data?.message || error.message));
        }
    };

    const filteredReviewers = reviewers.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Reviewer Database</h1>
                    <p className="text-slate-500 mt-1">Manage the panel of experts and monitor their activity.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input
                        placeholder="Search reviewers..."
                        className="pl-9 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-border/50 shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-border/50 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Active Reviewers</CardTitle>
                            <CardDescription>List of approved reviewers currently active in the system.</CardDescription>
                        </div>
                        <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
                            <ShieldCheck size={12} /> {reviewers.length} Verified Experts
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-slate-500">Loading directory...</p>
                        </div>
                    ) : filteredReviewers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Search className="text-slate-400" size={20} />
                            </div>
                            <p className="text-slate-500">No reviewers found matching your search.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredReviewers.map((r) => (
                                <div key={r._id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100 group-hover:scale-105 transition-transform">
                                            {r.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900 leading-none">{r.name}</p>
                                            <div className="flex items-center text-sm text-slate-500">
                                                <Mail size={12} className="mr-1.5" /> {r.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Role</p>
                                            <p className="text-sm font-medium text-slate-700 capitalize">{r.role.toLowerCase()}</p>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                            <CheckCircle size={14} /> Active
                                        </div>

                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="hidden group-hover:flex items-center gap-2"
                                            onClick={() => setSelectedReviewer(r)}
                                        >
                                            View Details
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(r._id, r.name)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Reviewer Details Modal */}
            <Dialog open={!!selectedReviewer} onOpenChange={(open) => !open && setSelectedReviewer(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <User className="text-primary" /> Reviewer Profile
                        </DialogTitle>
                        <DialogDescription>
                            Full information about the verified expert.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedReviewer && (
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-inner">
                                    {selectedReviewer.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedReviewer.name}</h3>
                                    <p className="text-slate-500 flex items-center gap-1.5 text-sm">
                                        <Mail size={14} /> {selectedReviewer.email}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Award size={12} /> Account Role
                                    </p>
                                    <p className="font-semibold text-slate-700 capitalize px-2.5 py-1 bg-indigo-50 rounded-lg border border-indigo-100 inline-block">
                                        {selectedReviewer.role}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Calendar size={12} /> Joined Date
                                    </p>
                                    <p className="font-semibold text-slate-700">
                                        {new Date(selectedReviewer.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <BookOpen size={12} /> Professional Qualifications
                                </p>
                                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm leading-relaxed text-slate-700 italic">
                                    "{selectedReviewer.qualifications || 'No qualifications listed.'}"
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800 text-sm font-medium">
                                <CheckCircle size={16} /> This reviewer is currently active and verified.
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminReviewers;
