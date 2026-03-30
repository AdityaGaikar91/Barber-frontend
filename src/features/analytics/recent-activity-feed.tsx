"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecentActivity, RecentActivity } from '@/services/analytics.service';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { User, Scissors, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function RecentActivityFeed() {
    const [activities, setActivities] = useState<RecentActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const limit = 10;

    const loadActivity = async (currentPage: number) => {
        try {
            setIsLoading(true);
            const response = await getRecentActivity(limit, currentPage);
            setActivities(response.data);
            setTotalPages(response.meta.totalPages);
        } catch (error) {
            toast.error("Failed to load recent activity");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadActivity(page);
        
        // Optional: Poll every 30 seconds for real-time feel if on page 1
        let interval: NodeJS.Timeout;
        if (page === 1) {
            interval = setInterval(() => loadActivity(1), 30000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [page]);

    return (
        <Card className="shadow-sm border-primary/10">
            <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Employee Activity Feed
                        </CardTitle>
                        <CardDescription>
                            Real-time transaction and appointment logs across all staff.
                        </CardDescription>
                    </div>
                    {isLoading && <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent motion-safe:animate-spin mr-2" />}
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                {activities.length === 0 && !isLoading ? (
                    <div className="py-8 text-center text-muted-foreground flex flex-col items-center">
                        <Activity className="h-10 w-10 text-muted/30 mb-3" />
                        <p>No recent activity detected.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <div key={activity.id} className="flex items-start justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                                        {activity.employeeName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium flex items-center gap-1.5">
                                            {activity.employeeName} 
                                            <span className="text-muted-foreground font-normal text-xs">served</span> 
                                            <User className="h-3 w-3 text-muted-foreground ml-0.5" />
                                            {activity.customerName}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full">
                                                <Scissors className="h-3 w-3" /> {activity.serviceName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge variant="outline" className="text-green-600 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 flex items-center gap-0.5">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(activity.amount)}
                                    </Badge>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                        {activity.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 pb-2 border-t mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || isLoading}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                                </Button>
                                <span className="text-xs text-muted-foreground font-medium">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages || isLoading}
                                >
                                    Next <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
