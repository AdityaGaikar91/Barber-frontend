"use client";
import React, { useState, useEffect } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, Customer } from "@/lib/customers.api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trash2, Plus, RefreshCw, Edit2, X, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    mode: "onTouched"
  });

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      setCustomers(data || []);
    } catch (error) {
      toast.error("Failed to load customers");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const onSubmit = async (values: z.infer<typeof customerSchema>) => {
    try {
      setIsSubmitting(true);
      // Clean up empty strings to undefined to match optional DB schema
      const cleanedValues = {
          name: values.name,
          email: values.email || undefined,
          phone: values.phone || undefined
      };

      if (editingCustomerId) {
        const updated = await updateCustomer(editingCustomerId, cleanedValues);
        setCustomers(customers.map(c => c.id === editingCustomerId ? updated : c));
        toast.success("Customer updated successfully!");
        cancelEdit();
      } else {
        const newCustomer = await createCustomer(cleanedValues);
        setCustomers([...customers, newCustomer]);
        toast.success("Customer added successfully!");
        reset();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${editingCustomerId ? 'update' : 'create'} customer`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomerId(customer.id);
    setValue("name", customer.name);
    setValue("email", customer.email || "");
    setValue("phone", customer.phone || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingCustomerId(null);
    reset({ name: "", email: "", phone: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer? Their transaction history will remain but the link will be broken.")) return;
    try {
      if (editingCustomerId === id) cancelEdit();
      await deleteCustomer(id);
      setCustomers(customers.filter((c) => c.id !== id));
      toast.success("Customer deleted");
    } catch (error) {
      toast.error("Failed to delete customer");
      console.error(error);
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
            <Users className="h-8 w-8 text-primary" /> Customers
          </h1>
          <p className="text-muted-foreground mt-1">Manage your clientele, view contact details, and edit profiles.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        {/* Table View */}
        <Card className="order-2 md:order-1 border-primary/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Customer Directory</CardTitle>
              <CardDescription>A list of all clients registered to your shop.</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={loadCustomers} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <Users className="h-10 w-10 text-muted-foreground mb-3 mx-auto opacity-20" />
                <p className="text-muted-foreground font-medium">No customers found.</p>
                <p className="text-sm text-muted-foreground mt-1">Add your first client from the panel on the right.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  <AnimatePresence>
                    {customers.map((customer, index) => (
                      <motion.div 
                        key={customer.id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group p-4 rounded-xl border transition-all duration-200 bg-card hover:shadow-md hover:border-primary/30 relative overflow-hidden ${editingCustomerId === customer.id ? 'border-primary ring-1 ring-primary/50' : 'border-border'}`}
                      >
                         <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40" onClick={() => handleEdit(customer)}>
                               <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40" onClick={() => handleDelete(customer.id)}>
                               <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                         </div>
                         
                         <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 rounded-full border-2 border-primary/10">
                              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-lg font-bold">
                                {customer.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col flex-1 truncate pr-16">
                               <span className="font-semibold text-base truncate">{customer.name}</span>
                               <div className="flex flex-col gap-1 mt-1">
                                  {customer.phone && (
                                     <span className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                                        <Phone className="h-3 w-3" /> {customer.phone}
                                     </span>
                                  )}
                                  {customer.email && (
                                     <span className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                                        <Mail className="h-3 w-3" /> {customer.email}
                                     </span>
                                  )}
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Form */}
        <Card className="order-1 md:order-2 h-fit md:sticky md:top-8 border-primary/20 shadow-sm bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-950/50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2">
              {editingCustomerId ? <Edit2 className="h-5 w-5 text-blue-500" /> : <Plus className="h-5 w-5 text-primary" />} 
              {editingCustomerId ? 'Edit Customer' : 'Add Client'}
            </CardTitle>
            {editingCustomerId && (
              <Button variant="ghost" size="icon" onClick={cancelEdit} className="h-8 w-8 text-muted-foreground rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                <Input placeholder="John Doe" {...register("name")} className="bg-background/50" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input placeholder="+1 234 567 8900" {...register("phone")} className="bg-background/50" />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input type="email" placeholder="john@example.com" {...register("email")} className="bg-background/50" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                   Adding an email allows them to receive automated appointment reminders and special offers.
                </p>
              </div>

              <Button type="submit" className="w-full mt-4 shadow-md shadow-primary/20" disabled={isSubmitting}>
                {isSubmitting ? (editingCustomerId ? "Updating..." : "Adding...") : (editingCustomerId ? "Update Profile" : "Add to Directory")}
              </Button>
              {editingCustomerId && (
                <Button type="button" variant="outline" className="w-full mt-2" onClick={cancelEdit} disabled={isSubmitting}>
                  Cancel
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
