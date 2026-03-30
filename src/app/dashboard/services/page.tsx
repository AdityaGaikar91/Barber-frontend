/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { getServices, createService, updateService, deleteService, Service } from "@/services/services.service";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Trash2, Plus, RefreshCw, Edit2, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number({ message: "Price is required" }).min(0, "Price must be positive"),
  duration: z.number({ message: "Duration is required" }).min(1, "Duration must be at least 1 minute"),
  category: z.string().optional(),
});

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { price: 0, duration: 30 },
    mode: "onTouched"
  });

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await getServices();
      setServices(data || []);
    } catch (error) {
      toast.error("Failed to load services");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const onSubmit = async (values: z.infer<typeof serviceSchema>) => {
    try {
      setIsSubmitting(true);
      if (editingServiceId) {
        // Update existing service
        const updated = await updateService(editingServiceId, values);
        setServices(services.map(s => s.id === editingServiceId ? updated : s));
        toast.success("Service updated successfully!");
        cancelEdit();
      } else {
        // Create new service
        const newService = await createService(values);
        setServices([...services, newService]);
        toast.success("Service created successfully!");
        reset();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${editingServiceId ? 'update' : 'create'} service`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingServiceId(service.id);
    setValue("name", service.name);
    setValue("description", service.description || "");
    setValue("price", service.price);
    setValue("duration", service.duration);
    setValue("category", service.category || "");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to form on mobile
  };

  const cancelEdit = () => {
    setEditingServiceId(null);
    reset({ name: "", description: "", price: 0, duration: 30, category: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      if (editingServiceId === id) cancelEdit();
      await deleteService(id);
      setServices(services.filter((s) => s.id !== id));
      toast.success("Service deleted");
    } catch (error) {
      toast.error("Failed to delete service");
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
            <Scissors className="h-8 w-8 text-primary" /> Services
          </h1>
          <p className="text-muted-foreground mt-1">Manage all the grooming services your shop offers.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        {/* Table View */}
        <Card className="order-2 md:order-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Available Services</CardTitle>
              <CardDescription>A list of everything set up so far.</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={loadServices} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-200 dark:border-gray-800">
                <p className="text-muted-foreground">No services found. Create one from the right.</p>
              </div>
            ) : (
              <div className="relative overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-900 border-b">
                    <tr>
                      <th className="px-6 py-4 font-medium">Service Name</th>
                      <th className="px-6 py-4 font-medium">Price</th>
                      <th className="px-6 py-4 font-medium">Duration</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {services.map((service, index) => (
                        <motion.tr 
                          key={service.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          className={`group bg-white dark:bg-transparent border-b hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors cursor-default ${editingServiceId === service.id ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary' : ''}`}
                        >
                          <td className="px-6 py-4 font-medium">
                            {service.name}
                            {service.description && (
                              <span className="block text-xs text-muted-foreground mt-1 font-normal group-hover:text-foreground/80 transition-colors">{service.description}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">₹{service.price}</td>
                          <td className="px-6 py-4 text-muted-foreground">{service.duration} mins</td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 h-full">
                               <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleEdit(service)} 
                                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                  title="Edit Service"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDelete(service.id)} 
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                                  title="Delete Service"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                             </div>
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

        {/* Create/Edit Form */}
        <Card className="order-1 md:order-2 h-fit md:sticky md:top-8 border-primary/20 shadow-sm bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-950/50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2">
              {editingServiceId ? <Edit2 className="h-5 w-5 text-blue-500" /> : <Plus className="h-5 w-5 text-primary" />} 
              {editingServiceId ? 'Edit Service' : 'Add New Service'}
            </CardTitle>
            {editingServiceId && (
              <Button variant="ghost" size="icon" onClick={cancelEdit} className="h-8 w-8 text-muted-foreground rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="e.g. Premium Haircut" {...register("name")} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input placeholder="Brief details about the service" {...register("description")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (₹)</label>
                  <Input type="number" placeholder="500" {...register("price", { valueAsNumber: true })} />
                  {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (Mins)</label>
                  <Input type="number" placeholder="30" {...register("duration", { valueAsNumber: true })} />
                  {errors.duration && <p className="text-xs text-red-500">{errors.duration.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input placeholder="e.g. Hair, Beard, Combo" {...register("category")} />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? (editingServiceId ? "Updating..." : "Creating...") : (editingServiceId ? "Update Service" : "Save Service")}
              </Button>
              {editingServiceId && (
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
