/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { appointmentsApi } from '@/services/appointments.service';
import { format } from 'date-fns';
import { Loader2, CheckCircle2 } from 'lucide-react';

const bookingSchema = z.object({
  serviceIds: z.array(z.string()).min(1, 'Please select at least one service'),
  employeeId: z.string().min(1, 'Please select a barber'),
  appointmentTime: z.any().refine((val) => val instanceof Date, "Please select a date and time"),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().min(10, 'Please enter a valid phone number'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm({ slug }: { slug: string }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceIds: [],
      customerName: '',
      customerPhone: '',
    }
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const info = await appointmentsApi.getPublicBookingInfo(slug);
        setData(info);
      } catch (error) {
        toast.error('Failed to load shop information');
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [slug]);

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitting(true);
    try {
      await appointmentsApi.createAppointment({
        ...values,
        tenantSlug: slug,
        appointmentTime: values.appointmentTime.toISOString(),
      });
      setSuccess(true);
      toast.success('Booking request sent successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
  if (!data) return <div className="text-center p-20">Shop not found</div>;

  if (success) {
    return (
      <Card className="max-w-md mx-auto mt-10 text-center p-10">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl mb-2">Appointment Requested!</CardTitle>
        <CardDescription className="text-lg">
          We&apos;ve received your request for <strong>{data.shopName}</strong>. 
          The staff will review and approve it shortly.
        </CardDescription>
        <Button className="mt-6" onClick={() => window.location.reload()}>Book Another</Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-xl border-t-4 border-t-primary">
      <CardHeader className="text-center border-b bg-muted/30">
        {data.logoUrl && (
          <div className="flex justify-center mb-3">
            <img 
              src={data.logoUrl} 
              alt={data.shopName} 
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-md"
            />
          </div>
        )}
        <CardTitle className="text-3xl font-bold">{data.shopName}</CardTitle>
        <CardDescription>Book your session in a few easy steps</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                {s}
              </div>
              {s < 3 && <div className="w-10 sm:w-20 h-1 bg-muted mx-2" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <Label className="text-lg mb-2 block">What service do you need?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-24 md:pb-4">
                {data.services.map((service: any) => (
                  <Button
                    key={service.id}
                    variant={(form.watch('serviceIds') || []).includes(service.id) ? 'default' : 'outline'}
                    className="h-auto py-4 px-4 justify-between"
                    onClick={() => {
                      const current = form.watch('serviceIds') || [];
                      if (current.includes(service.id)) {
                        form.setValue('serviceIds', current.filter((id: string) => id !== service.id));
                      } else {
                        form.setValue('serviceIds', [...current, service.id]);
                      }
                    }}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-xs opacity-70">{service.duration} mins</div>
                    </div>
                    <div className="font-bold">₹{service.price}</div>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background md:bg-transparent border-t shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none z-50 md:relative md:border-none md:p-0 flex justify-between items-center md:pt-4 md:border-t-2">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Selected: {(form.watch('serviceIds') || []).length}</p>
                <p className="font-bold text-lg">Total: ₹{data.services.filter((s: any) => (form.watch('serviceIds') || []).includes(s.id)).reduce((acc: number, curr: any) => acc + curr.price, 0)}</p>
              </div>
              <Button 
                onClick={() => setStep(2)} 
                disabled={(form.watch('serviceIds') || []).length === 0}
                className="w-1/2 md:w-auto h-12 text-lg"
              >
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <Label className="text-lg mb-2 block">Choose your Barber</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-24 md:pb-4">
                {data.employees.map((emp: any) => (
                  <Button
                    key={emp.id}
                    variant={form.watch('employeeId') === emp.id ? 'default' : 'outline'}
                    className="h-auto py-4 justify-start text-left"
                    onClick={() => {
                      form.setValue('employeeId', emp.id);
                      setStep(3);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 font-bold text-primary">
                      {emp.name ? emp.name[0].toUpperCase() : 'B'}
                    </div>
                    <div>
                      <div className="font-semibold">{emp.name || emp.email || 'Professional'}</div>
                      <div className="text-xs opacity-70">Professional Stylist</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background md:bg-transparent border-t shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none z-50 md:relative md:border-none md:p-0 flex justify-between items-center md:pt-4 md:border-t-2">
              <Button variant="outline" onClick={() => setStep(1)} className="w-1/3 md:w-auto h-12">Back</Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!form.watch('employeeId')}
                className="w-1/2 md:w-auto h-12 text-lg"
              >
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-24 md:pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-lg mb-2 block font-medium">Pick a Date</Label>
                <Calendar
                  mode="single"
                  selected={form.watch('appointmentTime')}
                  onSelect={(date) => {
                    if (date) {
                      const newDate = new Date(date);
                      const current = form.getValues('appointmentTime') || new Date();
                      newDate.setHours(current.getHours(), current.getMinutes());
                      form.setValue('appointmentTime', newDate);
                    }
                  }}
                  disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0,0,0,0))}
                  className="rounded-md border shadow"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-lg mb-2 block font-medium">Select Time</Label>
                  <Input 
                    type="time" 
                    className="w-full h-12 text-lg"
                    value={
                      form.watch('appointmentTime') instanceof Date 
                      ? `${form.watch('appointmentTime').getHours().toString().padStart(2, '0')}:${form.watch('appointmentTime').getMinutes().toString().padStart(2, '0')}`
                      : ''
                    }
                    onChange={(e) => {
                      const time = e.target.value;
                      if (time) {
                        const [hours, minutes] = time.split(':');
                        const date = form.getValues('appointmentTime') || new Date();
                        date.setHours(parseInt(hours), parseInt(minutes));
                        form.setValue('appointmentTime', date);
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Note: Time slots are precisely scheduled but subject to shop approval.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Label className="font-medium">Your Details</Label>
                  <Input 
                    placeholder="Your Full Name" 
                    {...form.register('customerName')}
                  />
                  <Input 
                    placeholder="Phone Number" 
                    {...form.register('customerPhone')}
                  />
                  
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="h-12 w-1/3" onClick={() => setStep(2)}>Back</Button>
                    <Button 
                      className="w-2/3 h-12 text-lg font-bold" 
                      disabled={submitting || !form.watch('customerName') || !form.watch('customerPhone') || !form.watch('appointmentTime')}
                      onClick={form.handleSubmit(onSubmit)}
                    >
                      {submitting ? <Loader2 className="animate-spin mr-2" /> : "Confirm Booking"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
