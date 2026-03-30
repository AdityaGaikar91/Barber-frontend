"use client";
import React, { useState, useEffect } from "react";
import { getEmployees, Employee, getEmployeeMetrics, EmployeeMetrics } from "@/services/employees.service";
import { getEmployeeTransactions, Transaction } from "@/services/transactions.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Scissors, Clock, RefreshCw } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import Link from 'next/link';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
};

export default function EmployeeDashboard() {
  const { user } = useAuthStore();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<EmployeeMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [date, setDate] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date()
  });

  const loadProfileAndHistory = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      // 1. Get all employees and find current user's employee ID
      const allEmployees = await getEmployees();
      const myProfile = allEmployees.find(emp => emp.userId === user.id);
      
      if (!myProfile) {
        toast.error("Employee profile not found. Please contact the owner.");
        setIsLoading(false);
        return;
      }


      // 2. Load metrics and recent transactions
      const [fetchedMetrics, fetchedTransactions] = await Promise.all([
          getEmployeeMetrics(myProfile.id, date?.from, date?.to),
          getEmployeeTransactions(myProfile.id)
      ]);
      setMetrics(fetchedMetrics);
      setTransactions(fetchedTransactions || []);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load your dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileAndHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, date?.from, date?.to]);

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
          <h1 className="text-3xl font-bold tracking-tight">Hello, {user.name}</h1>
          <p className="text-muted-foreground mt-2">Here is a summary of your performance.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button variant="outline" size="icon" onClick={loadProfileAndHistory} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-3">
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300 dark:bg-card/50 backdrop-blur border-primary/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Services (Selected Period)</CardTitle>
              <Scissors className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="relative z-10">
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
              ) : (
                <div className="text-2xl font-bold">{metrics?.totalServices || 0}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300 dark:bg-card/50 backdrop-blur border-primary/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Revenue (Selected Period)</CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="relative z-10">
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
              ) : (
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">₹{metrics?.totalRevenue || 0}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
           <Link href="/employee/transactions">
            <motion.div whileHover={{ scale: 1.03, y: -5 }} whileTap={{ scale: 0.98 }} className="h-full">
              <Card className="shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-primary/50 bg-primary text-primary-foreground group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">Log New Service</CardTitle>
                  <Banknote className="h-6 w-6 transition-transform group-hover:scale-125 duration-300" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary-foreground/80">Record a customer visit.</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.3, type: "spring", bounce: 0.3 }}
         className="grid gap-6 md:grid-cols-2 lg:col-span-7"
       >
        <Card className="lg:col-span-4 dark:bg-card/30 backdrop-blur border-primary/5 hover:border-primary/20 transition-colors shadow-sm">
          <CardHeader>
            <CardTitle>Your Earnings Trend</CardTitle>
            <CardDescription>
              A visual breakdown of your performance across the date range.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
             {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-muted/20 animate-pulse rounded-lg">
                   <p className="text-muted-foreground">Loading chart data...</p>
                </div>
             ) : metrics?.timeSeries && metrics.timeSeries.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                            formatter={(value: unknown) => [`₹${value}`, 'Revenue']}
                            labelFormatter={(label) => new Date(label as string).toLocaleDateString()}
                            cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                        />
                        <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
             ) : (
                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/10">
                    <p className="text-muted-foreground font-medium">No Earnings Data</p>
                </div>
             )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 dark:bg-card/30 backdrop-blur border-primary/5 hover:border-primary/20 transition-colors">
          <CardHeader>
            <CardTitle>Global Recent History</CardTitle>
            <CardDescription>
              Your latest logged transactions across all time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl border-border/50">
                <p className="text-muted-foreground mb-4">You haven&apos;t logged any services yet.</p>
                 <Link href="/employee/transactions" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary/90 transition-all">
                  Log your first service
               </Link>
              </div>
            ) : (
              <div className="relative overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-900 border-b">
                    <tr>
                      <th className="px-6 py-4 font-medium">Date & Time</th>
                      <th className="px-6 py-4 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {transactions.slice(0, 5).map((tx) => (
                        <motion.tr 
                          key={tx.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white dark:bg-transparent border-b hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                        >
                          <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                            <div className="flex items-center gap-2 text-xs">
                              <Clock className="h-3.5 w-3.5" />
                              {format(new Date(tx.timestamp), "MMM d, h:mm a")}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-green-600 dark:text-green-400">
                            ₹{tx.amount}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
       </motion.div>
    </div>
  );
}
