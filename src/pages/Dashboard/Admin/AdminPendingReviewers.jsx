import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { UserCheck, UserX, Clock, Mail, BookOpen, AlertCircle } from 'lucide-react';

const AdminPendingReviewers = () => {
    const [pendingReviewers, setPendingReviewers] = useState([]);
    const [processingId, setProcessingId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/api/users/pending-reviewers');
            setPendingReviewers(res.data);
        } catch (error) {
            console.error("Error fetching pending reviewers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (userId, status) => {
        try {
            setProcessingId(userId);
            await axiosInstance.post('/api/users/reviewer-status', { userId, status });
            // Remove from list locally
            setPendingReviewers(prev => prev.filter(r => r._id !== userId));
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900">Pending Approvals</h1>
                <p className="text-slate-500 mt-1">Review and approve new reviewer applications.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingReviewers.map(r => (
                    <Card key={r._id} className="overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 border-border/50 group">
                        <CardHeader className="pb-4 border-b border-border/50 bg-slate-50/50">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                            {r.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-slate-900">{r.name}</CardTitle>
                                            <div className="flex items-center text-xs text-slate-500">
                                                <Mail size={12} className="mr-1" /> {r.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                                    <Clock size={12} /> Pending
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 text-sm space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    <BookOpen size={12} /> Qualifications
                                </div>
                                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed italic">
                                    "{r.qualifications}"
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 p-4 flex gap-3 border-t border-border/50">
                            <Button
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                                size="sm"
                                onClick={() => handleStatus(r._id, 'APPROVED')}
                                disabled={processingId === r._id}
                            >
                                <UserCheck size={16} className="mr-2" />
                                {processingId === r._id ? 'Processing...' : 'Approve'}
                            </Button>
                            <Button
                                className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatus(r._id, 'REJECTED')}
                                disabled={processingId === r._id}
                            >
                                <UserX size={16} className="mr-2" />
                                {processingId === r._id ? 'Processing...' : 'Reject'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {pendingReviewers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <UserCheck className="text-emerald-500" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No Pending Requests</h3>
                    <p className="max-w-xs text-center">There are no new reviewer applications pending approval at this time.</p>
                </div>
            )}
        </div>
    );
};

export default AdminPendingReviewers;
