import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, Calendar, AlertCircle, CheckCircle, Clock, XCircle, ChevronRight, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthorDashboard = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const res = await axiosInstance.get('/api/papers/my-papers');
                setPapers(res.data);
            } catch (error) {
                console.error("Error fetching papers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPapers();
    }, []);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'PUBLISHED':
                return { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: CheckCircle, label: 'Published' };
            case 'REJECTED':
                return { color: 'text-red-600 bg-red-50 border-red-100', icon: XCircle, label: 'Rejected' };
            case 'UNDER_REVIEW':
                return { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Clock, label: 'Under Review' };
            default:
                return { color: 'text-slate-600 bg-slate-50 border-slate-100', icon: FileText, label: 'Submitted' };
        }
    };

    const handleViewPdf = (paperId) => {
        window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/papers/stream/${paperId}`, '_blank');
    };


    // Calculate Stats
    const stats = [
        { label: 'Total Submissions', value: papers.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Published', value: papers.filter(p => p.status === 'PUBLISHED').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Under Review', value: papers.filter(p => p.status === 'UNDER_REVIEW').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Rejected', value: papers.filter(p => p.status === 'REJECTED').length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    return (
        <DashboardLayout role="author">
            <div className="space-y-8 animate-fade-in-up">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900">Author Dashboard</h1>
                        <p className="text-slate-500 mt-1">Manage your research submissions and track their progress.</p>
                    </div>
                    <Button asChild className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                        <Link to="/submit-paper" className="flex items-center gap-2">
                            <FileText size={18} /> Submit New Manuscript
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-6 rounded-xl border border-border/50 shadow-soft hover:shadow-soft-lg transition-all duration-300 group">
                            <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Submissions */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="text-primary" size={20} /> Recent Submissions
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : papers.length === 0 ? (
                        <Card className="border-dashed border-2 shadow-none bg-slate-50/50">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="text-slate-400" size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Papers Submitted</h3>
                                <p className="text-slate-500 max-w-sm mb-6">
                                    You haven't submitted any research papers yet. Start your journey by submitting your first manuscript.
                                </p>
                                <Button asChild variant="outline">
                                    <Link to="/submit-paper">Submit Manuscript</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {papers.map((paper) => {
                                const status = getStatusInfo(paper.status);
                                return (
                                    <div key={paper._id} className="group bg-white rounded-xl border border-border/50 shadow-soft hover:shadow-soft-lg transition-all duration-300 p-6 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit ${status.color}`}>
                                                    <status.icon size={12} />
                                                    {status.label}
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(paper.submittedAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
                                                {paper.title}
                                            </h3>
                                            <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                                                {paper.abstract}
                                            </p>

                                            {paper.reviewRemark && (
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                                                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Editor's Remarks</p>
                                                    <p className="text-sm text-slate-600 italic">"{paper.reviewRemark}"</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex md:flex-col gap-3 justify-center md:border-l md:pl-6 md:border-slate-100 min-w-[140px]">
                                            <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs h-9" onClick={() => handleViewPdf(paper._id)}>
                                                <Eye size={14} /> View PDF
                                            </Button>
                                            {paper.status === 'PUBLISHED' && (
                                                <Button size="sm" className="w-full justify-start gap-2 text-xs h-9 bg-primary text-white shadow-md shadow-primary/20" onClick={() => handleViewPdf(paper._id)}>
                                                    <Download size={14} /> Download
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs h-9 text-slate-400 hover:text-primary" asChild>
                                                <Link to={`/paper/${paper._id}`}>
                                                    Details <ChevronRight size={14} className="ml-auto" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AuthorDashboard;
