import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";  // Assumption: Textarea component exists
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"; // Assumption: Select component exists
import { FileText, CheckCircle, Clock, AlertCircle, Edit, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';

const ReviewerDashboard = () => {
    const location = useLocation();
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Review Dialog State
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [remark, setRemark] = useState('');
    const [recommendation, setRecommendation] = useState('ACCEPTED');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);

    const { user: currentUser } = useAuth();

    const fetchAssignedPapers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/api/papers/assigned');
            setPapers(res.data);
        } catch (error) {
            console.error("Error fetching papers", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAssignedPapers();
    }, [fetchAssignedPapers]);

    const handleViewPdf = (paperId) => {
        window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/papers/stream/${paperId}`, '_blank');
    };

    const submitReview = async () => {
        if (!selectedPaper) return;

        try {
            await axiosInstance.post('/api/papers/review', {
                paperId: selectedPaper._id,
                remark,
                recommendation
            });
            setDialogOpen(false);
            setSuccessDialogOpen(true);
            fetchAssignedPapers();
        } catch (error) {
            console.error("Review failed", error);
            // Ideally show a toast error here
        }
    };

    const openReviewDialog = (paper) => {
        setSelectedPaper(paper);
        const myReview = paper.reviewers?.find(r => {
            const rId = r.reviewerId?._id || r.reviewerId;
            const uId = currentUser?._id || currentUser?.id;
            return String(rId) === String(uId);
        });

        if (myReview && myReview.status === 'REVIEWED') {
            setRemark(myReview.remark || '');
            setRecommendation(myReview.recommendation || 'ACCEPTED');
        } else {
            setRemark('');
            setRecommendation('ACCEPTED');
        }
        setDialogOpen(true);
    };

    // Filter Logic
    const getMyReview = (paper) => {
        return paper.reviewers?.find(r => {
            const rId = r.reviewerId?._id || r.reviewerId;
            const uId = currentUser?._id || currentUser?.id;
            return String(rId) === String(uId);
        });
    };

    const pendingPapers = papers.filter(p => {
        const myReview = getMyReview(p);
        return myReview && myReview.status === 'ASSIGNED';
    });

    const completedPapers = papers.filter(p => {
        const myReview = getMyReview(p);
        return myReview && myReview.status === 'REVIEWED';
    });

    const PaperCard = ({ paper, isCompleted }) => (
        <div key={paper._id} className="group bg-white rounded-xl border border-border/50 shadow-soft hover:shadow-soft-lg transition-all duration-300 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            {paper.category || 'Research Paper'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> {new Date(paper.submittedAt).toLocaleDateString()}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
                        {paper.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                        {paper.abstract}
                    </p>
                </div>
                {/* Status Badge for Completed */}
                {isCompleted && (
                    <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getMyReview(paper)?.recommendation === 'ACCEPTED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : getMyReview(paper)?.recommendation === 'REJECTED'
                                ? 'bg-red-50 text-red-700 border-red-100'
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                        {getMyReview(paper)?.recommendation === 'ACCEPTED' ? <ThumbsUp size={12} /> :
                            getMyReview(paper)?.recommendation === 'REJECTED' ? <ThumbsDown size={12} /> : <AlertCircle size={12} />}
                        {getMyReview(paper)?.recommendation?.replace('_', ' ')}
                    </div>
                )}
            </div>

            <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary -ml-2" onClick={() => handleViewPdf(paper._id)}>
                    <ExternalLink size={14} className="mr-2" /> View Manuscript
                </Button>

                <Button
                    size="sm"
                    onClick={() => openReviewDialog(paper)}
                    className={isCompleted ? "bg-white border-primary text-primary hover:bg-primary/5 border" : "shadow-md shadow-primary/20"}
                    variant={isCompleted ? "outline" : "default"}
                >
                    {isCompleted ? <><Edit size={14} className="mr-2" /> Edit Review</> : <><CheckCircle size={14} className="mr-2" /> Submit Review</>}
                </Button>
            </div>
        </div>
    );

    return (
        <DashboardLayout role="reviewer">
            <div className="space-y-8 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Reviewer Workspace</h1>
                    <p className="text-slate-500 mt-1">Manage your assigned reviews and contribute to scientific excellence.</p>
                </div>

                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8 bg-slate-100/50 p-1">
                        <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending Reviews ({pendingPapers.length})</TabsTrigger>
                        <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">History ({completedPapers.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-6">
                        {loading ? (
                            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                        ) : pendingPapers.length === 0 ? (
                            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <CheckCircle className="text-emerald-500" size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">All Caught Up!</h3>
                                <p className="text-slate-500">You have no pending papers to review at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {pendingPapers.map(paper => <PaperCard key={paper._id} paper={paper} isCompleted={false} />)}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-6">
                        {loading ? (
                            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                        ) : completedPapers.length === 0 ? (
                            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-500">You haven't submitted any reviews yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {completedPapers.map(paper => <PaperCard key={paper._id} paper={paper} isCompleted={true} />)}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Submit Review Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Submit Review</DialogTitle>
                            <CardDescription>Evaluation for "{selectedPaper?.title}"</CardDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Detailed Feedback & Remarks</Label>
                                <textarea
                                    className="flex min-h-[150px] w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 resize-none"
                                    placeholder="Please provide constructive feedback, highlighting strengths and areas for improvement..."
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Recommendation</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['ACCEPTED', 'CHANGES_REQUIRED', 'REJECTED'].map((option) => (
                                        <div
                                            key={option}
                                            onClick={() => setRecommendation(option)}
                                            className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${recommendation === option
                                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="font-semibold text-xs">{option.replace('_', ' ')}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={submitReview} className="shadow-lg shadow-primary/20">Submit Review</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Success Dialog */}
                <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle className="text-green-600" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Review Submitted!</h2>
                            <p className="text-slate-500">Thank you for your valuable contribution to the journal.</p>
                            <Button className="w-full mt-4" onClick={() => setSuccessDialogOpen(false)}>Return to Dashboard</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default ReviewerDashboard;
