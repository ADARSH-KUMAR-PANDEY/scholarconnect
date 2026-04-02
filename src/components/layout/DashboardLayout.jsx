import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    CheckSquare,
    BookOpen
} from 'lucide-react';
import { Button } from '../ui/button';

const DashboardLayout = ({ children, role }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = {
        admin: [
            { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
            { icon: Users, label: 'Authors', path: '/admin/authors' },
            { icon: Users, label: 'Reviewers', path: '/admin/reviewers' },
            { icon: FileText, label: 'Pending Approvals', path: '/admin/pending-reviewers' },
            { icon: BookOpen, label: 'All Papers', path: '/admin/papers' },
        ],
        reviewer: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/reviewer' },
            { icon: FileText, label: 'Assigned Papers', path: '/reviewer/assigned' },
            { icon: CheckSquare, label: 'Completed Reviews', path: '/reviewer/completed' },
        ],
        author: [
            { icon: LayoutDashboard, label: 'My Papers', path: '/author' },
            { icon: FileText, label: 'Submit New Paper', path: '/submit-paper' }, // Link to public for now or internal
        ]
    };

    const currentNav = navItems[role] || [];

    return (
        <div className="min-h-screen bg-slate-50/50 flex font-sans text-slate-800">
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0F172A] text-slate-300
                    transform transition-transform duration-300 ease-in-out border-r border-slate-800 shadow-xl
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="h-20 flex items-center px-8 border-b border-slate-800/50">
                    <div className="bg-primary-foreground/10 p-2 rounded-lg mr-3">
                        <BookOpen className="text-white" size={24} />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight font-heading">ScholarConnect</span>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                            Menu
                        </div>
                        <div className="space-y-1">
                            {currentNav.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path || (item.path !== role && location.pathname.startsWith(item.path));
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                                            ${isActive
                                                ? 'bg-accent text-white shadow-lg shadow-accent/20 translate-x-1'
                                                : 'hover:bg-white/5 hover:text-white hover:translate-x-1'
                                            }
                                        `}
                                    >
                                        <Icon size={20} className={isActive ? 'opacity-100' : 'opacity-70'} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 w-full p-6 border-t border-slate-800/50 bg-[#0F172A]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm flex items-center justify-between px-6 md:px-10 sticky top-0 z-30">
                    <button
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-6 ml-auto">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-800 leading-none">{user?.name}</p>
                                <p className="text-xs text-slate-500 mt-1 capitalize">{user?.role}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
