import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { FileText, Download, User, Search, Calendar, ArrowRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublishedPapers = () => {
    const [papers, setPapers] = useState([]);
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const response = await axiosInstance.get('/api/papers/published');
                setPapers(response.data);
                setFilteredPapers(response.data);
            } catch (err) {
                console.error("Failed to load papers", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPapers();
    }, []);

    useEffect(() => {
        const results = papers.filter(paper =>
            paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paper.authorId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paper.abstract.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPapers(results);
    }, [searchTerm, papers]);

    // Handle PDF viewing
    const handleViewPdf = (paperId) => {
        window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/papers/stream/${paperId}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900/40 z-0"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/10 blur-3xl transform rotate-12 translate-x-1/4"></div>

                <div className="container mx-auto px-6 py-20 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                        Explore Cutting-Edge Research
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Access peer-reviewed articles from scholars worldwide. Discover new insights and stay ahead in your field.
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <Input
                            className="w-full h-14 pl-12 pr-4 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 transition-all shadow-lg"
                            placeholder="Search by title, author, or keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-6 py-16">
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 rounded-xl bg-slate-200 animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredPapers.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                            <Search size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No papers found</h3>
                        <p className="text-slate-500">Try adjusting your search terms or browse all papers.</p>
                        <Button
                            variant="link"
                            className="mt-4 text-primary"
                            onClick={() => setSearchTerm('')}
                        >
                            Clear Search
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Latest Publications</h2>
                            <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                                {filteredPapers.length} Result{filteredPapers.length !== 1 && 's'}
                            </span>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPapers.map((paper) => (
                                <Card key={paper._id} className="flex flex-col h-full border-0 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden bg-white">
                                    <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 mb-2">
                                                Research Paper
                                            </Badge>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Calendar size={12} />
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublishedPapers;
