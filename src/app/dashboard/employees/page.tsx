/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { getEmployees, createEmployee, Employee } from "@/services/employees.service";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
  bio: z.string().optional(),
});

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    mode: "onTouched",
  });

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await getEmployees();
      setEmployees(data || []);
    } catch (error) {
      toast.error("Failed to load employees");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const onSubmit = async (values: z.infer<typeof employeeSchema>) => {
    try {
      setIsSubmitting(true);
      // Let backend auto-generate pass or use empty, we set default "Employee123!" in API client if empty
      const newEmployee = await createEmployee({
        ...values,
        password: values.password || "Employee123!",
      });
      setEmployees([...employees, newEmployee]);
      toast.success("Employee created successfully! Their login is their email and password.");
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create employee");
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
            <Users className="h-8 w-8 text-primary" /> Employees
          </h1>
          <p className="text-muted-foreground mt-1">Manage barber shop staff and view their profiles.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        {/* Table View */}
        <Card className="order-2 md:order-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Team</CardTitle>
              <CardDescription>All employees registered under this shop.</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={loadEmployees} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-200 dark:border-gray-800">
                <p className="text-muted-foreground">No employees found. Add staff from the right.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <AnimatePresence>
                  {employees.map((employee, index) => (
                    <motion.div 
                      key={employee.id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group flex flex-col items-start gap-4 p-5 border border-gray-200/50 dark:border-gray-800 rounded-2xl bg-white/50 dark:bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer relative overflow-hidden"
                    >
                      {/* Decorative background beam on hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="flex items-start gap-4 w-full relative z-10">
                        <Avatar className="h-14 w-14 rounded-xl ring-2 ring-primary/10 group-hover:ring-primary/40 transition-all shadow-inner">
                          <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold rounded-xl rounded-tl-none uppercase">
                            {employee.name ? employee.name.charAt(0) : 'E'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1">
                          <span className="font-semibold text-base group-hover:text-primary transition-colors">
                            {employee.name || `User ID: ${employee.userId.substring(0, 8)}...`}
                          </span>
                          {employee.email && (
                            <span className="text-xs text-muted-foreground mt-0.5">{employee.email}</span>
                          )}
                          <span className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {employee.bio || "No bio assigned yet."}
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-full flex justify-end relative z-10">
                        <span className="text-[10px] bg-secondary/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors w-fit px-2.5 py-1 rounded-full font-bold tracking-wider">BARBER</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Form */}
        <Card className="order-1 md:order-2 h-fit md:sticky md:top-8 border-primary/20 shadow-sm bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Add New Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input placeholder="John Doe" {...register("name")} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="john@barberpro.com" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-medium flex justify-between">
                    Password
                    <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                 </label>
                <Input type="password" placeholder="Leave blank for 'Employee123!'" {...register("password")} />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Input placeholder="Specialist in fades" {...register("bio")} />
              </div>

              <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Employee"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
