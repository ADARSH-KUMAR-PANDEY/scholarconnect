import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BookOpen, FileText, CheckCircle, Users, Globe, Award, ChevronRight, Menu, Mail, Upload, Shield, Zap, Search, Calendar, Eye, Download } from 'lucide-react';

const LandingPage = () => {
    const [latestPapers, setLatestPapers] = useState([]);
    const [loadingPapers, setLoadingPapers] = useState(true);

    useEffect(() => {
        const fetchLatestPapers = async () => {
            try {
                const response = await axiosInstance.get('/api/papers/published');
                // Only take the top 3 latest papers based on submittedAt
                const sortedPapers = response.data.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
                setLatestPapers(sortedPapers.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch latest papers for home page", err);
            } finally {
                setLoadingPapers(false);
            }
        };

        fetchLatestPapers();
    }, []);

    const handleViewPdf = (paperId) => {
        window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/papers/stream/${paperId}`, '_blank');
    };
    return (
        <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col">
            {/* 1. Header & Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-lg shadow-sm">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="bg-primary text-white p-2 rounded-lg shadow-lg shadow-primary/20">
                            <BookOpen size={24} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight font-heading">ScholarConnect</span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        {['Journal', 'Publications', 'Contact'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-primary transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" asChild className="hidden sm:flex hover:bg-white/50">
                            <Link to="/login">Login</Link>
                        </Button>
                        <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                            <Link to="/submit-paper">Submit Manuscript</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* 2. Hero Section */}
                <section className="relative overflow-hidden pt-24 pb-20">
                    <div className="absolute inset-0 bg-slate-50 -z-20"></div>
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-100/50 to-transparent -z-10 blur-3xl rounded-full translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-indigo-100/50 to-transparent -z-10 blur-3xl rounded-full -translate-x-1/3"></div>

                    <div className="container mx-auto px-6 text-center">
                        <div className="space-y-8 max-w-4xl mx-auto relative z-10">
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-blue-700 text-sm font-bold uppercase tracking-wider">
                                <Award size={18} className="text-blue-500" />
                                Impact Factor: <span className="text-primary ml-1">7.85</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-heading font-bold text-slate-900 leading-[1.05] tracking-tight">
                                Advancing <span className="text-primary">Global Knowledge</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                                ScholarConnect is a premier peer-reviewed platform empowering the next generation of researchers to publish high-impact science.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6 pt-6">
                                <Button asChild size="lg" className="h-16 px-10 text-xl rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300">
                                    <Link to="/published-papers">View Publications</Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-16 px-10 text-xl rounded-full border-slate-300 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-300">
                                    <Link to="/submit-paper">Submit Manuscript</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Key Features */}
                <section id="features" className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: 'Rapid Processing', icon: <Zap size={28} />, color: 'bg-blue-50 text-blue-600', description: 'Fast-track peer review system ensuring quick decisions.' },
                                { title: 'High Visibility', icon: <Search size={28} />, color: 'bg-indigo-50 text-indigo-600', description: 'SEO optimized and cross-indexed for maximum research visibility.' },
                                { title: 'Secure Archiving', icon: <Shield size={28} />, color: 'bg-emerald-50 text-emerald-600', description: 'Permanent digital archiving for all published publications.' }
                            ].map((feature, idx) => (
                                <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                                    <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Latest Research Publications */}
                <section id="publications" className="py-24 bg-slate-50 border-y border-slate-100">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 mb-4 tracking-tight">Recent <span className="text-primary">Research</span></h2>
                                <p className="text-lg text-slate-600 max-w-xl">Direct access to the most recent high-impact publications.</p>
                            </div>
                            <Button asChild variant="ghost" className="text-primary font-bold text-lg hover:bg-white px-0 hover:px-4 transition-all">
                                <Link to="/published-papers">View All Publications <ChevronRight className="ml-1" size={20} /></Link>
                            </Button>
                        </div>
                        
                        {loadingPapers ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-64 rounded-xl bg-slate-100 animate-pulse"></div>
                                ))}
                            </div>
                        ) : latestPapers.length > 0 ? (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                    {latestPapers.map((paper) => (
                                        <Card key={paper._id} className="flex flex-col h-full border-0 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden bg-white">
                                            <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                            <CardHeader className="pb-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 mb-2">
                                                        Research Paper
                                                    </Badge>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        {paper.submittedAt ? new Date(paper.submittedAt).toLocaleDateString() : 'Recently'}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-xl font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                    {paper.title}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 text-sm text-slate-500 pt-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                        {paper.authorId?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <span className="font-medium text-slate-700">{paper.authorId?.name || 'Unknown Author'}</span>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="grow">
                                                <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
                                                    {paper.abstract}
                                                </p>
                                            </CardContent>
                                            <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-50 flex gap-3 bg-slate-50/30">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-slate-200 hover:border-primary hover:text-primary hover:bg-blue-50 transition-colors"
                                                    onClick={() => handleViewPdf(paper._id)}
                                                >
                                                    <Eye size={16} className="mr-2" /> Read
                                                </Button>
                                                <Button
                                                    className="flex-1 bg-slate-900 text-white hover:bg-primary shadow-md hover:shadow-lg transition-all"
                                                    onClick={() => handleViewPdf(paper._id)}
                                                >
                                                    <Download size={16} className="mr-2" /> Download
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>

                            </>
                        ) : (
                            <div className="text-center text-slate-500 py-12">
                                No published papers available at the moment.
                            </div>
                        )}
                    </div>
                </section>

                {/* Spacer before footer */}
                <div className="py-12 bg-white"></div>
            </main>

            {/* 6. Footer */}
            <footer id="contact" className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
                <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-white">
                            <BookOpen size={24} />
                            <span className="text-xl font-bold tracking-tight font-heading">ScholarConnect</span>
                        </div>
                        <p className="leading-relaxed">
                            A global platform dedicated to the advancement of science, technology, and humanities through open access publishing.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-base">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><a href="#" className="hover:text-white transition-colors">Current Issues</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Archives</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Editorial Board</a></li>
                        </ul>
                    </div>



                    <div>
                        <h4 className="text-white font-bold mb-6 text-base">Contact</h4>
                        <div className="space-y-4">
                            <p className="flex items-center gap-3">
                                <Mail size={16} className="text-primary" /> editor@scholarconnect.com
                            </p>
                            <p className="flex items-center gap-3">
                                <Globe size={16} className="text-primary" /> www.scholarconnect.com
                            </p>
                            <div className="pt-4 flex gap-4">
                                {/* Social Icons Placeholders */}
                                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-900 text-center text-xs text-slate-600">
                    <p>&copy; {new Date().getFullYear()} ScholarConnect. All Rights Reserved. | Designed for Global Excellence.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
