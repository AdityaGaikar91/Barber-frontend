/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scissors, Users, RefreshCw, Component } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { getDashboardMetrics, DashboardMetrics } from '@/services/analytics.service';
import { toast } from 'sonner';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { RecentActivityFeed } from '@/features/analytics/recent-activity-feed';
import { QuickActionsBar } from '@/features/dashboard/quick-actions';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
};

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Default to Today
  const [date, setDate] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date()
  });

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const data = await getDashboardMetrics(date?.from, date?.to);
      setMetrics(data);
    } catch (error) {
      toast.error("Failed to load dashboard metrics");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [date?.from, date?.to]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground mt-2">Here&apos;s your business performance overview.</p>
          <QuickActionsBar />
        </div>
        <div className="flex items-center gap-3">
          <DatePickerWithRange date={date} setDate={setDate} />
          <button 
            onClick={loadMetrics} 
            disabled={isLoading}
            className="p-2 h-10 w-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-md shadow-sm border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg border-primary/20 bg-gradient-to-br from-background to-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today&apos;s Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold text-green-600 dark:text-green-500">₹{metrics?.todayRevenue || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Yesterday: <span className="font-medium text-foreground">₹{metrics?.yesterdayRevenue || 0}</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Month to Date</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold text-primary">₹{metrics?.monthToDateRevenue || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Total revenue since 1st of this month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Selected Period Revenue</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                ) : (
                    <div className="text-3xl font-bold">₹{metrics?.totalRevenue || 0}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">Sum of all transactions in date range</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300 dark:bg-card/50 backdrop-blur border-primary/10 relative overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Top Performing Service</CardTitle>
              <Scissors className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="relative z-10">
                {isLoading ? (
                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
                ) : metrics?.topServices && metrics.topServices.length > 0 ? (
                    <div>
                        <div className="text-xl font-bold truncate">{metrics.topServices[0].name}</div>
                        <p className="text-xs text-muted-foreground mt-1">₹{metrics.topServices[0].revenue} ({metrics.topServices[0].count} times)</p>
                    </div>
                ) : (
                    <div className="text-muted-foreground text-sm mt-1">No services logged</div>
                )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300 dark:bg-card/50 backdrop-blur border-primary/10 relative overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Total Customers Reached</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="relative z-10">
                {isLoading ? (
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
                ) : (
                    <div className="text-2xl font-bold">{metrics?.totalCustomers || 0}</div>
                )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300 dark:bg-card/50 backdrop-blur border-primary/10 relative overflow-hidden group bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Employee Leaderboard</CardTitle>
              <Component className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent className="relative z-10">
                {isLoading ? (
                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
                ) : metrics?.topEmployeeId ? (
                    <div>
                       <div className="text-lg font-bold truncate flex items-center gap-2">
                          <span className="text-yellow-500">🏆</span> {metrics.topEmployeeName || `ID: ${metrics.topEmployeeId.substring(0,6)}`}
                       </div>
                       <p className="text-xs text-muted-foreground mt-1 text-green-500 font-medium">₹{metrics.topEmployeeRevenue} Generated</p>
                    </div>
                ) : (
                    <div className="text-muted-foreground text-sm mt-1">No data available</div>
                )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2, type: "spring", bounce: 0.3 }}
         className="grid gap-6 md:grid-cols-3"
       >
        {/* Revenue Chart */}
        <Card className="md:col-span-2 shadow-sm border-primary/10">
          <CardHeader>
            <CardTitle>Revenue Time-Series</CardTitle>
            <CardDescription>
              Daily earnings breakdown for the selected period.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] mt-4">
             {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-muted/20 animate-pulse rounded-lg">
                   <p className="text-muted-foreground">Loading chart data...</p>
                </div>
             ) : metrics?.timeSeries && metrics.timeSeries.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                        <XAxis 
                           dataKey="date" 
                           tickFormatter={(value) => {
                               const d = new Date(value);
                               return `${d.getDate()}/${d.getMonth()+1}`;
                           }} 
                           tickLine={false} 
                           axisLine={false} 
                           tick={{ fontSize: 12 }} 
                           dy={10}
                        />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: any) => [`₹${value}`, 'Revenue']}
                            labelFormatter={(label) => new Date(label as string).toLocaleDateString()}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                 </ResponsiveContainer>
             ) : (
                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/10">
                    <p className="text-muted-foreground font-medium">No Revenue Data in Range</p>
                </div>
             )}
          </CardContent>
        </Card>

        {/* Top Services Breakdown */}
        <Card className="shadow-sm border-primary/10">
          <CardHeader>
            <CardTitle>Services Breakdown</CardTitle>
            <CardDescription>
              Most profitable services sorted by revenue.
            </CardDescription>
          </CardHeader>
           <CardContent className="pt-4">
             {isLoading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-12 w-full bg-muted/40 animate-pulse rounded-md"></div>)}
                </div>
             ) : metrics?.topServices && metrics.topServices.length > 0 ? (
                <div className="space-y-5">
                   {metrics.topServices.map((service, index) => (
                       <div key={service.id} className="flex items-center justify-between group">
                           <div className="flex items-center gap-3">
                               <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                   #{index + 1}
                               </div>
                               <div>
                                   <p className="text-sm font-semibold leading-none">{service.name}</p>
                                   <p className="text-xs text-muted-foreground mt-1">{service.count} times rendered</p>
                               </div>
                           </div>
                           <Badge variant="secondary" className="font-mono text-green-600 dark:text-green-400 bg-green-500/10">
                               ₹{service.revenue}
                           </Badge>
                       </div>
                   ))}
                </div>
             ) : (
                <div className="py-12 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">No services recorded in range.</p>
                </div>
             )}
          </CardContent>
        </Card>
       </motion.div>

       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.3, type: "spring", bounce: 0.3 }}
         className="mt-6"
       >
         <RecentActivityFeed />
       </motion.div>
    </div>
  );
}
