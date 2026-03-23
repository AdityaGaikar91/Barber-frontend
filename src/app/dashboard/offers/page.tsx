"use client";
import React, { useState, useEffect } from "react";
import { getOffers, createOffer, updateOffer, deleteOffer, Offer } from "@/lib/offers.api";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tag, Trash2, Plus, RefreshCw, Edit2, X, AlertCircle, Percent, Calendar as CalendarIcon, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format, isPast, isFuture } from "date-fns";
import { Badge } from "@/components/ui/badge";

const offerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  discountPercentage: z.number().min(1, "Discount must be at least 1%").max(100, "Discount cannot exceed 100%"),
  validFrom: z.string().min(1, "Start date is required"),
  validUntil: z.string().min(1, "End date is required"),
  isActive: z.boolean().default(true)
}).refine(data => {
   return new Date(data.validFrom) <= new Date(data.validUntil);
}, {
   message: "End date must be after the start date",
   path: ["validUntil"]
});

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
    resolver: zodResolver(offerSchema),
    mode: "onTouched",
    defaultValues: {
      isActive: true
    }
  });

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const data = await getOffers();
      setOffers(data || []);
    } catch (error) {
      toast.error("Failed to load offers");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const onSubmit = async (values: z.infer<typeof offerSchema>) => {
    try {
      setIsSubmitting(true);
      // Format dates to ISO strings for NestJS
      const payload = {
        title: values.title,
        discountPercentage: values.discountPercentage,
        validFrom: new Date(values.validFrom).toISOString(),
        validUntil: new Date(values.validUntil).toISOString(),
        isActive: values.isActive
      };

      if (editingOfferId) {
        const updated = await updateOffer(editingOfferId, payload);
        setOffers(offers.map(o => o.id === editingOfferId ? updated : o));
        toast.success("Offer updated!");
        cancelEdit();
      } else {
        const newOffer = await createOffer(payload);
        setOffers([...offers, newOffer]);
        toast.success("Offer created!");
        reset();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${editingOfferId ? 'update' : 'create'} offer`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOfferId(offer.id);
    setValue("title", offer.title);
    setValue("discountPercentage", offer.discountPercentage);
    
    // Format dates for html input type="datetime-local" roughly
    const formatForInput = (isoDate: string) => {
       const date = new Date(isoDate);
       return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    setValue("validFrom", formatForInput(offer.validFrom));
    setValue("validUntil", formatForInput(offer.validUntil));
    setValue("isActive", offer.isActive);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingOfferId(null);
    reset();
  };

  const toggleStatus = async (offer: Offer) => {
    try {
       const updated = await updateOffer(offer.id, { isActive: !offer.isActive });
       setOffers(offers.map(o => o.id === offer.id ? updated : o));
       toast.success(`Offer marks as ${updated.isActive ? 'Active' : 'Inactive'}`);
    } catch (error) {
       toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      if (editingOfferId === id) cancelEdit();
      await deleteOffer(id);
      setOffers(offers.filter((o) => o.id !== id));
      toast.success("Offer deleted");
    } catch (error) {
      toast.error("Failed to delete offer");
      console.error(error);
    }
  };

  const getStatusBadge = (offer: Offer) => {
     if (!offer.isActive) return <Badge variant="secondary" className="bg-gray-100 text-gray-500 dark:bg-gray-800">Inactive</Badge>;
     if (isPast(new Date(offer.validUntil))) return <Badge variant="destructive">Expired</Badge>;
     if (isFuture(new Date(offer.validFrom))) return <Badge variant="outline" className="border-blue-500 text-blue-500">Upcoming</Badge>;
     return <Badge className="bg-green-500 hover:bg-green-600">Active Now</Badge>;
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
            <Tag className="h-8 w-8 text-primary" /> Promotional Offers
          </h1>
          <p className="text-muted-foreground mt-1">Create limited-time discounts and packages for your customers.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        {/* Gallery View */}
        <div className="order-2 md:order-1 space-y-4">
            <div className="flex justify-between items-center bg-card p-2 px-4 rounded-lg border">
                <span className="text-sm text-muted-foreground font-medium flex items-center gap-2 text-primary">
                    <Percent className="h-4 w-4" /> Available Campaigns
                </span>
                <Button variant="ghost" size="icon" onClick={loadOffers} disabled={isLoading} className="h-8 w-8">
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <Tag className="h-12 w-12 text-muted-foreground mb-4 mx-auto opacity-20" />
                <p className="text-foreground font-semibold text-lg">No offers created yet.</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">Boost your sales by creating a special discount for your customers.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {offers.map((offer, index) => (
                      <motion.div 
                        key={offer.id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                      >
                         <Card className={`group transition-all duration-200 hover:shadow-lg relative overflow-hidden ${editingOfferId === offer.id ? 'border-primary ring-1 ring-primary/50' : 'border-border'}`}>
                             {/* Decorative Background */}
                             <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
                             
                             <CardHeader className="pb-2 flex flex-row items-start justify-between">
                                 <div>
                                    <CardTitle className="text-xl relative inline-block">
                                        {offer.title}
                                    </CardTitle>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-sm font-bold px-2 py-0.5">
                                            {offer.discountPercentage}% OFF
                                        </Badge>
                                        {getStatusBadge(offer)}
                                    </div>
                                 </div>
                                 <div className="flex bg-background/80 backdrop-blur-sm rounded-md shadow-sm border p-0.5 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500" onClick={() => handleEdit(offer)}>
                                       <Edit2 className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className={`h-7 w-7 ${offer.isActive ? 'text-orange-500' : 'text-green-500'}`} onClick={() => toggleStatus(offer)}>
                                       {offer.isActive ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleDelete(offer.id)}>
                                       <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                 </div>
                             </CardHeader>
                             <CardContent className="pb-4">
                                 <div className="flex flex-col gap-1.5 mt-2">
                                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                         <CalendarIcon className="h-3.5 w-3.5" />
                                         <span>Valid From: <strong className="text-foreground">{format(new Date(offer.validFrom), 'MMM d, yyyy h:mm a')}</strong></span>
                                     </div>
                                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                         <AlertCircle className="h-3.5 w-3.5" />
                                         <span>Expires: <strong className="text-foreground">{format(new Date(offer.validUntil), 'MMM d, yyyy h:mm a')}</strong></span>
                                     </div>
                                 </div>
                             </CardContent>
                         </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
              </div>
            )}
        </div>

        {/* Create/Edit Form */}
        <Card className="order-1 md:order-2 h-fit md:sticky md:top-8 border-primary/20 shadow-sm bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-950/50">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50 mb-4 bg-background/50 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-lg">
              {editingOfferId ? <Edit2 className="h-5 w-5 text-blue-500" /> : <Plus className="h-5 w-5 text-primary" />} 
              {editingOfferId ? 'Edit Campaign' : 'New Campaign'}
            </CardTitle>
            {editingOfferId && (
              <Button variant="ghost" size="icon" onClick={cancelEdit} className="h-8 w-8 text-muted-foreground rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Title <span className="text-red-500">*</span></label>
                <Input placeholder="e.g. Summer Special 2026" {...register("title")} className="bg-background/50" />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Percentage (%) <span className="text-red-500">*</span></label>
                <Input type="number" placeholder="20" {...register("discountPercentage", { valueAsNumber: true })} className="bg-background/50 font-bold text-primary" />
                {errors.discountPercentage && <p className="text-xs text-red-500">{errors.discountPercentage.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date & Time <span className="text-red-500">*</span></label>
                <Input type="datetime-local" {...register("validFrom")} className="bg-background/50" />
                {errors.validFrom && <p className="text-xs text-red-500">{errors.validFrom.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date & Time <span className="text-red-500">*</span></label>
                <Input type="datetime-local" {...register("validUntil")} className="bg-background/50" />
                {errors.validUntil && <p className="text-xs text-red-500">{errors.validUntil.message}</p>}
              </div>

              <Button type="submit" className="w-full mt-6 shadow-md shadow-primary/20" disabled={isSubmitting}>
                {isSubmitting ? (editingOfferId ? "Updating..." : "Creating...") : (editingOfferId ? "Update Campaign" : "Launch Campaign")}
              </Button>
              {editingOfferId && (
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
