'use client';

import { useState, useEffect } from 'react';
import { appointmentsApi } from '@/services/appointments.service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { AppointmentModal } from './appointment-modal';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string | null;
  appointmentTime: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  service: { name: string; price: number };
  employee: { user: { name: string } };
}

export function AppointmentsCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // View State
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDay, setSelectedDay] = useState(new Date());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsApi.getTenantAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentWeekStart]);

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  const dailyAppointments = appointments.filter(a => isSameDay(new Date(a.appointmentTime), selectedDay)).sort((a,b) => new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'APPROVED': return <Badge variant="outline" className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="bg-green-100 text-green-800">Done</Badge>;
      case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleCreateNew = () => {
    setModalInitialDate(selectedDay);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await appointmentsApi.updateStatus(id, status);
      toast.success(`Appointment ${status.toLowerCase()}ed`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
          <p className="text-muted-foreground mt-1">Manage barber appointments and shifts</p>
        </div>
        <Button onClick={handleCreateNew} size="lg" className="rounded-full shadow-lg">
          <Plus className="w-5 h-5 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Modern Horizontal Calendar Strip */}
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-xl">
        <CardContent className="p-4 flex items-center justify-between overflow-x-auto gap-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex gap-2 flex-grow justify-center">
            {weekDays.map((day, i) => {
              const isActive = isSameDay(day, selectedDay);
              return (
                <div 
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  className={`flex flex-col items-center p-3 rounded-2xl cursor-pointer transition-all min-w-[60px] ${isActive ? 'bg-primary text-primary-foreground shadow-md scale-105' : 'hover:bg-muted'}`}
                >
                  <span className="text-xs font-medium uppercase mb-1 opacity-80">{format(day, 'EEE')}</span>
                  <span className="text-lg font-bold">{format(day, 'd')}</span>
                </div>
              );
            })}
          </div>

          <Button variant="ghost" size="icon" onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Appointments Timeline / List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
          {format(selectedDay, 'EEEE, MMMM do, yyyy')}
        </h3>

        {loading ? (
          <div className="text-center p-12 text-muted-foreground animate-pulse">Loading schedule...</div>
        ) : dailyAppointments.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed rounded-xl bg-muted/10 text-muted-foreground flex flex-col items-center">
            <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg">No appointments scheduled for this day.</p>
            <Button variant="outline" className="mt-4" onClick={handleCreateNew}>Add one now</Button>
          </div>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {dailyAppointments.map((apt, index) => (
               <div key={apt.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                 {/* Timeline dot */}
                 <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform hover:scale-110">
                   <Clock className="w-4 h-4 text-primary-foreground" />
                 </div>
                 
                 {/* Card */}
                 <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                      <div className="text-lg font-semibold flex items-center text-primary">
                        <span className="bg-primary/10 px-2 py-1 rounded-md mr-2">{format(new Date(apt.appointmentTime), 'h:mm a')}</span>
                        {apt.customerName}
                      </div>
                      {getStatusBadge(apt.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" /> Barber: <span className="font-medium text-foreground">{apt.employee.user.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-secondary/30 flex items-center justify-center text-[10px]">✂</div> 
                        {apt.service.name} (₹{apt.service.price})
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      {apt.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => handleStatusUpdate(apt.id, 'APPROVED')}>Approve</Button>
                          <Button size="sm" variant="ghost" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}>Reject</Button>
                        </>
                      )}
                      {apt.status === 'APPROVED' && (
                        <>
                           <Button size="sm" className="flex-1" onClick={() => handleStatusUpdate(apt.id, 'COMPLETED')}>Complete</Button>
                           <Button size="sm" variant="ghost" className="flex-1" onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}>Cancel</Button>
                        </>
                      )}
                       {apt.status === 'COMPLETED' && (
                        <p className="text-xs text-center w-full text-muted-foreground italic">Appointment Finished</p>
                      )}
                    </div>
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAppointments}
        selectedDate={modalInitialDate}
      />
    </div>
  );
}
