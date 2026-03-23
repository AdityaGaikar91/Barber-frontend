"use client";
import React, { useState, useEffect } from "react";
import { getServices, Service } from "@/lib/services.api";
import { getEmployees, Employee } from "@/lib/employees.api";
import { getCustomers, Customer } from "@/lib/customers.api";
import { logTransaction, getEmployeeTransactions, Transaction } from "@/lib/transactions.api";
import { useAuthStore } from "@/store/useAuthStore";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Banknote, Plus, RefreshCw, Clock } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const transactionSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  customerName: z.string().optional(),
  customerPhone: z.string().min(10, 'Phone must be at least 10 digits').optional().or(z.literal("")),
  amount: z.number({ message: "Amount is required" }).min(0, "Amount must be positive"),
});

interface ExtendedTransaction extends Transaction {
  serviceName?: string;
  customerName?: string;
}

export default function EmployeeTransactionsPage() {
  const { user } = useAuthStore();
  const [employeeProfile, setEmployeeProfile] = useState<Employee | null>(null);
  
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    mode: "onTouched",
  });

  const selectedServiceId = watch("serviceId");

  const loadData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      
      const allEmployees = await getEmployees();
      const myProfile = allEmployees.find(emp => emp.userId === user.id);
      
      if (!myProfile) {
        toast.error("Employee profile not found.");
        setIsLoading(false);
        return;
      }
      setEmployeeProfile(myProfile);

      const [fetchedServices, fetchedTransactions, fetchedCustomers] = await Promise.all([
        getServices(),
        getEmployeeTransactions(myProfile.id),
        getCustomers()
      ]);
      
      setServices(fetchedServices || []);
      setCustomers(fetchedCustomers || []);

      const enrichedTx = (fetchedTransactions || []).map(tx => {
        const srv = fetchedServices.find(s => s.id === tx.serviceId);
        const cus = fetchedCustomers.find(c => c.id === tx.customerId);
        return {
          ...tx,
          serviceName: srv ? srv.name : "Unknown Service",
          customerName: cus ? cus.name : "Walk-in Customer"
        };
      });

      // Sort by newest first
      enrichedTx.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setTransactions(enrichedTx);
      
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-fill price when a service is selected
  useEffect(() => {
    if (selectedServiceId && services.length > 0) {
      const selectedService = services.find(s => s.id === selectedServiceId);
      if (selectedService) {
        setValue("amount", selectedService.price, { shouldValidate: true });
      }
    }
  }, [selectedServiceId, services, setValue]);

  const onSubmit = async (values: z.infer<typeof transactionSchema>) => {
    if (!employeeProfile) {
        toast.error("Cannot log service: missing profile.");
        return;
    }
    
    try {
      setIsSubmitting(true);
      let finalCustomerId = undefined;

      if (values.customerPhone && values.customerName) {
        try {
          // Temporarily import dynamically to avoid top-level import conflict if needed, or assume it's imported at the top. Wait, we need to import it! I'll add the import soon.
          const { findOrCreateCustomer } = await import('@/lib/customers.api');
          const customer = await findOrCreateCustomer({
            name: values.customerName,
            phone: values.customerPhone,
          });
          finalCustomerId = customer.id;
        } catch (e) {
          console.error("Failed to link or create customer:", e);
        }
      }

      const payload = {
        serviceId: values.serviceId,
        amount: values.amount,
        customerId: finalCustomerId
      };

      const newTx = await logTransaction(employeeProfile.id, payload);
      
      const srv = services.find(s => s.id === newTx.serviceId);
      const cus = customers.find(c => c.id === newTx.customerId);
      
      const enrichedNewTx: ExtendedTransaction = {
        ...newTx,
        serviceName: srv ? srv.name : "Unknown Service",
        customerName: cus ? cus.name : "Walk-in Customer"
      };

      setTransactions([enrichedNewTx, ...transactions]);
      toast.success("Service logged successfully!");
      
      reset({ serviceId: "", customerName: "", customerPhone: "", amount: undefined });
    } catch (error: unknown) {
      toast.error((error as any).response?.data?.message || "Failed to log service");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Plus className="h-8 w-8 text-primary" /> Log Completed Service
          </h1>
          <p className="text-muted-foreground mt-1">Select the service you provided to register it in your history.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        {/* Table View */}
        <Card className="order-2 md:order-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Recent Logs</CardTitle>
              <CardDescription>A list of services you&apos;ve recorded.</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={loadData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-200 dark:border-gray-800">
                <p className="text-muted-foreground">You haven&apos;t logged any services yet.</p>
              </div>
            ) : (
              <div className="relative overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-900 border-b">
                    <tr>
                      <th className="px-6 py-4 font-medium">Date & Time</th>
                      <th className="px-6 py-4 font-medium">Service</th>
                      <th className="px-6 py-4 font-medium hidden md:table-cell">Customer</th>
                      <th className="px-6 py-4 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {transactions.map((tx, index) => (
                        <motion.tr 
                          key={tx.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: Math.min(index * 0.05, 0.5) }} 
                          className="group bg-white dark:bg-transparent border-b hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors cursor-default"
                        >
                          <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5" />
                              {format(new Date(tx.timestamp), "MMM d, h:mm a")}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {tx.serviceName}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                             {tx.customerName}
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

        {/* Create Form */}
        <Card className="order-1 md:order-2 h-fit md:sticky md:top-8 border-primary/20 shadow-sm bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" /> New Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
               <div className="text-sm text-center py-6 text-muted-foreground bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed">
                 No services are set up in the system. Contact the owner.
               </div>
            ) : !employeeProfile ? (
                 <div className="text-sm text-center py-6 text-muted-foreground bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed flex justify-center items-center">
                 <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Loading Profile...
               </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Customer Name</label>
                    <Input placeholder="John Doe" {...register("customerName")} />
                    {errors.customerName && <p className="text-xs text-red-500">{errors.customerName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Customer Phone</label>
                    <Input placeholder="9876543210" {...register("customerPhone")} />
                    {errors.customerPhone && <p className="text-xs text-red-500">{errors.customerPhone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Performed</label>
                  <Controller
                    name="serviceId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map(srv => (
                            <SelectItem key={srv.id} value={srv.id}>
                              {srv.name} (₹{srv.price})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.serviceId && <p className="text-xs text-red-500">{errors.serviceId.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Charged Amount (₹)</label>
                  <Input type="number" placeholder="500" {...register("amount", { valueAsNumber: true })} />
                  {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
                  <p className="text-[10px] text-muted-foreground">Adjust this if a discount was applied.</p>
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                  {isSubmitting ? "Logging..." : "Log Service"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
