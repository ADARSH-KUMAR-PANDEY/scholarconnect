import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Mail, Search, User, Trash2, Calendar, Award, BookOpen, CheckCircle } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

const AdminAuthors = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState(null);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get('/api/users/authors');
                setAuthors(res.data);
            } catch (error) {
                console.error("Error fetching authors", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthors();
    }, []);

    const handleDelete = async (userId, name) => {
        if (!window.confirm(`Are you sure you want to remove author ${name} from the system? This action cannot be undone.`)) {
            return;
        }

        try {
            await axiosInstance.delete(`/api/users/${userId}`);
            setAuthors(authors.filter(a => a._id !== userId));
        } catch (error) {
            console.error("Error deleting author", error);
            alert("Failed to delete author: " + (error.response?.data?.message || error.message));
        }
    };

    const filteredAuthors = authors.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Author Database</h1>
                    <p className="text-slate-500 mt-1">Manage platform contributors and researchers.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input
                        placeholder="Search authors..."
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
                            <CardTitle>Registered Authors</CardTitle>
                            <CardDescription>List of all authors and researcher accounts.</CardDescription>
                        </div>
                        <div className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-indigo-200">
                            <User size={12} /> {authors.length} Contributors
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-slate-500">Loading directory...</p>
                        </div>
                    ) : filteredAuthors.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Search className="text-slate-400" size={20} />
                            </div>
                            <p className="text-slate-500">No authors found matching your search.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredAuthors.map((a) => (
                                <div key={a._id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-lg border border-slate-200 group-hover:scale-105 transition-transform">
                                            {a.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900 leading-none">{a.name}</p>
                                            <div className="flex items-center text-sm text-slate-500">
                                                <Mail size={12} className="mr-1.5" /> {a.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Joined</p>
                                            <p className="text-sm font-medium text-slate-700">
                                                {new Date(a.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-primary hover:text-primary/80 hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => setSelectedAuthor(a)}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDelete(a._id, a.name)}
                                            >
                                                <Trash2 size={16} className="mr-2" />
                                                Remove Author
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Author Details Modal */}
            <Dialog open={!!selectedAuthor} onOpenChange={(open) => !open && setSelectedAuthor(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <User className="text-primary" /> Author Profile
                        </DialogTitle>
                        <DialogDescription>
                            Researcher account details and activity summary.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAuthor && (
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="h-16 w-16 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-2xl shadow-inner">
                                    {selectedAuthor.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedAuthor.name}</h3>
                                    <p className="text-slate-500 flex items-center gap-1.5 text-sm">
                                        <Mail size={14} /> {selectedAuthor.email}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Award size={12} /> Role
                                    </p>
                                    <p className="font-semibold text-slate-700 capitalize px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 inline-block">
                                        {selectedAuthor.role}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Calendar size={12} /> Joined On
                                    </p>
                                    <p className="font-semibold text-slate-700">
                                        {new Date(selectedAuthor.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <CheckCircle size={12} /> Account Status
                                </p>
                                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800 text-sm font-medium flex items-center gap-2">
                                    <CheckCircle size={16} /> Verified Active Contributor
                                </div>
                            </div>
                            
                            <p className="text-xs text-slate-400 text-center italic">
                                Authors can submit papers, track review status, and manage their published research.
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminAuthors;
