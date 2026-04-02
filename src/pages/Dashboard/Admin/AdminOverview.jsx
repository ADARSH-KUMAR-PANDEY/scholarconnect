import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Users, FileText, CheckCircle, Clock, TrendingUp, AlertCircle, BarChart3, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminOverview = () => {
    const [stats, setStats] = useState({
        totalPapers: 0,
        publishedPapers: 0,
        pendingPapers: 0,
        totalReviewers: 0,
        pendingReviewers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Parallel fetch for overview data
                const [papersRes, reviewersRes, pendingRevRes] = await Promise.all([
                    axiosInstance.get('/api/papers/all'),
                    axiosInstance.get('/api/users/reviewers'),
                    axiosInstance.get('/api/users/pending-reviewers')
                ]);

                const papers = papersRes.data;

                setStats({
                    totalPapers: papers.length,
                    publishedPapers: papers.filter(p => p.status === 'PUBLISHED').length,
                    pendingPapers: papers.filter(p => p.status === 'UNDER_REVIEW' || p.status === 'SUBMITTED').length,
                    totalReviewers: reviewersRes.data.length,
                    pendingReviewers: pendingRevRes.data.length
                });

            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Total Submissions',
            value: stats.totalPapers,
            icon: FileText,
            trend: '+12%',
            desc: 'from last month',
            color: 'text-blue-600',
            bg: 'bg-blue-100',
            border: 'border-blue-100'
        },
        {
            title: 'Published Papers',
            value: stats.publishedPapers,
            icon: CheckCircle,
            trend: '+5%',
            desc: 'from last month',
            color: 'text-emerald-600',
            bg: 'bg-emerald-100',
            border: 'border-emerald-100'
        },
        {
            title: 'Active Reviewers',
            value: stats.totalReviewers,
            icon: Users,
            trend: '+2',
            desc: 'new this week',
            color: 'text-indigo-600',
            bg: 'bg-indigo-100',
            border: 'border-indigo-100'
        },
        {
            title: 'Pending Papers',
            value: stats.pendingPapers,
            icon: Clock,
            trend: 'Action',
            desc: 'Awaiting decision',
            color: 'text-amber-600',
            bg: 'bg-amber-100',
            border: 'border-amber-100'
        },
        {
            title: 'Reviewer Requests',
            value: stats.pendingReviewers,
            icon: AlertCircle,
            trend: 'Action',
            desc: 'Requires approval',
            color: 'text-purple-600',
            bg: 'bg-purple-100',
            border: 'border-purple-100'
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900">System Overview</h1>
                    <p className="text-slate-500 mt-1">Monitor journal performance and manage pending actions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        System Operational
                    </span>
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        <BarChart3 size={16} className="mr-2" /> Download Report
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, idx) => (
                    <Card key={idx} className={`border-l-4 ${card.border.replace('border', 'border-l')} shadow-soft hover:shadow-soft-lg transition-all duration-300`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${card.bg}`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{loading ? '-' : card.value}</div>
                            <div className="flex items-center text-xs mt-1">
                                <span className={`flex items-center font-medium ${card.trend === 'Action' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                    {card.trend !== 'Action' && <TrendingUp size={12} className="mr-1" />}
                                    {card.trend}
                                </span>
                                <span className="text-slate-400 ml-1.5">{card.desc}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <Card className="lg:col-span-2 shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ShieldCheck className="text-primary" size={20} /> Administrative Actions
                        </CardTitle>
                        <CardDescription>Common tasks and management shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                        <Link to="/admin/pending-reviewers" className="group p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 flex items-start justify-between">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">Approve Reviewers</h3>
                                <p className="text-sm text-slate-500">Review and approve new reviewer applications.</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                <ArrowUpRight size={18} />
                            </div>
                        </Link>

                        <Link to="/admin/papers" className="group p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 flex items-start justify-between">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">Manage Submissions</h3>
                                <p className="text-sm text-slate-500">View all papers and oversee review processes.</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                <ArrowUpRight size={18} />
                            </div>
                        </Link>

                        <Link to="/admin/reviewers" className="group p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 flex items-start justify-between">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">Reviewer Database</h3>
                                <p className="text-sm text-slate-500">Manage existing reviewer accounts and roles.</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                <ArrowUpRight size={18} />
                            </div>
                        </Link>

                        <Link to="/admin/authors" className="group p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 flex items-start justify-between">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">Author Database</h3>
                                <p className="text-sm text-slate-500">Manage registered authors and contributors.</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                <ArrowUpRight size={18} />
                            </div>
                        </Link>
                    </CardContent>
                </Card>

                {/* System Health / Notices */}
                <Card className="shadow-soft bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <AlertCircle size={20} className="text-blue-400" /> System Notices
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h4 className="font-semibold text-sm text-blue-200 mb-1">Scheduled Maintenance</h4>
                            <p className="text-xs text-slate-300">
                                System maintenance scheduled for Sunday, 2:00 AM - 4:00 AM UTC.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Server Load</span>
                                <span className="text-emerald-400 font-bold">12%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[12%] rounded-full"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Storage Usage</span>
                                <span className="text-blue-400 font-bold">45%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[45%] rounded-full"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminOverview;
