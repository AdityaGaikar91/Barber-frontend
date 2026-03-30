'use client';

import { useState, useEffect } from 'react';
import { appointmentsApi } from '@/services/appointments.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Scissors, User, MapPin, Check } from 'lucide-react';

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string | null;
  appointmentTime: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  service: {
    name: string;
    price: number;
    duration: number;
  };
}

export function EmployeeSchedule() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedDay = new Date(); // Hardcoded to today for mobile view

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsApi.getEmployeeAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to load your schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await appointmentsApi.updateStatus(id, status);
      toast.success(`Appointment marked as ${status.toLowerCase()}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const dailyAppointments = appointments
    .filter(a => isSameDay(new Date(a.appointmentTime), selectedDay))
    .sort((a,b) => new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'APPROVED': return <Badge variant="outline" className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Mobile Header */}
      <div className="py-4 border-b -mx-4 px-4 sm:mx-0 sm:px-0 sticky top-0 bg-background/90 backdrop-blur-md z-10">
        <h2 className="text-2xl font-bold tracking-tight">Today's Schedule</h2>
        <p className="text-muted-foreground mt-1 flex items-center text-sm">
          <CalendarIcon className="w-4 h-4 mr-1" />
          {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(selectedDay)}
        </p>
      </div>

      {loading ? (
        <div className="text-center p-12 text-muted-foreground motion-safe:animate-pulse">Loading your appointments…</div>
      ) : dailyAppointments.length === 0 ? (
        <Card className="border-dashed bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-primary opacity-50" />
            </div>
            <p className="text-lg font-medium">No appointments today</p>
            <p className="text-sm mt-1">Enjoy your free time or check back later.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {dailyAppointments.map((apt) => {
            const appointmentDate = new Date(apt.appointmentTime);
            const endTime = new Date(appointmentDate.getTime() + apt.service.duration * 60000);
            
            return (
              <Card key={apt.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-row">
                  {/* Time column */}
                  <div className="bg-muted/30 p-4 border-r flex flex-col items-center justify-center min-w-[90px]">
                    <span className="text-sm font-bold">{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(appointmentDate).split(' ')[0]}</span>
                    <span className="text-xs text-muted-foreground">{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(appointmentDate).split(' ')[1]}</span>
                    <div className="w-px h-6 bg-border my-1 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(endTime)}</span>
                  </div>

                  {/* Content column */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="text-lg font-bold truncate pr-2 flex items-center">
                          {apt.customerName}
                        </h3>
                        <div className="shrink-0">{getStatusBadge(apt.status)}</div>
                      </div>
                      
                      {apt.customerPhone && (
                        <p className="text-sm text-muted-foreground flex items-center mb-1">
                          <User className="w-3 h-3 mr-1" /> {apt.customerPhone}
                        </p>
                      )}
                      
                      <div className="text-sm border bg-secondary/20 rounded-lg p-2 mt-2 flex justify-between items-center">
                        <div className="flex items-center text-primary font-medium">
                          <Scissors className="w-4 h-4 mr-2" />
                          {apt.service.name}
                        </div>
                        <span className="text-muted-foreground font-semibold">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(apt.service.price)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t flex gap-2">
                      {apt.status === 'APPROVED' && (
                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(apt.id, 'COMPLETED')}>
                           Mark Completed
                        </Button>
                      )}
                      {apt.status === 'COMPLETED' && (
                         <Button variant="secondary" className="w-full gap-2" disabled>
                           Completed <Check className="w-4 h-4" />
                         </Button>
                      )}
                      {apt.status === 'PENDING' && (
                         <div className="flex w-full gap-2">
                             <Button className="flex-1" onClick={() => handleStatusUpdate(apt.id, 'APPROVED')}>Approve</Button>
                             <Button variant="destructive" className="flex-1" onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}>Reject</Button>
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
