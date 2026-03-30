'use client';

import { useState, useEffect } from 'react';
import { appointmentsApi } from '@/services/appointments.service';
import { getEmployees, Employee } from '@/services/employees.service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { AppointmentModal } from './appointment-modal';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  customerName: string;
  appointmentTime: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  service: { name: string; price: number; duration: number };
  employeeId?: string;
  employee: { id: string; user: { name: string } };
}

// Generate time slots from 8 AM to 8 PM (half-hour chunks)
const TIME_START_HOUR = 8;
const TIME_END_HOUR = 20;

export function AppointmentsGrid() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  
  // View State
  const [selectedDay, setSelectedDay] = useState(new Date());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>();
  const [modalInitialEmployee, setModalInitialEmployee] = useState<string | undefined>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptData, empData] = await Promise.all([
        appointmentsApi.getTenantAppointments(),
        getEmployees(),
      ]);
      setAppointments(apptData);
      setEmployees(empData);
    } catch (error) {
      toast.error('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDay]);

  const dailyAppointments = appointments.filter(a => isSameDay(new Date(a.appointmentTime), selectedDay));

  const handleCreateNew = () => {
    setModalInitialDate(selectedDay);
    setModalInitialEmployee(undefined);
    setIsModalOpen(true);
  };

  const handleSlotClick = (hour: number, minute: number, employeeId: string) => {
    const slotDate = new Date(selectedDay);
    slotDate.setHours(hour, minute, 0, 0);
    setModalInitialDate(slotDate);
    setModalInitialEmployee(employeeId);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (id: string, status: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents slot click
    try {
      await appointmentsApi.updateStatus(id, status);
      toast.success(`Appointment ${status.toLowerCase()}ed`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-[10px] px-1 h-4">Pen</Badge>;
      case 'APPROVED': return <Badge variant="outline" className="bg-blue-100 text-blue-800 text-[10px] px-1 h-4">Cnf</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="bg-green-100 text-green-800 text-[10px] px-1 h-4">Done</Badge>;
      case 'CANCELLED': return <Badge variant="destructive" className="text-[10px] px-1 h-4">Can</Badge>;
      default: return null;
    }
  };

  // Generate an array of time strings for the Y axis
  const timeSlots = [];
  for (let h = TIME_START_HOUR; h < TIME_END_HOUR; h++) {
    timeSlots.push({ hour: h, minute: 0, label: `${h === 12 ? 12 : h % 12}:00 ${h >= 12 ? 'PM' : 'AM'}` });
    timeSlots.push({ hour: h, minute: 30, label: `${h === 12 ? 12 : h % 12}:30 ${h >= 12 ? 'PM' : 'AM'}` });
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Staff Schedule</h2>
          <p className="text-muted-foreground mt-1 cursor-pointer flex items-center hover:text-primary transition-colors">
            <Button variant="ghost" size="icon" onClick={() => setSelectedDay(addDays(selectedDay, -1))} className="h-6 w-6 mr-1">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <CalendarIcon className="w-4 h-4 mr-2" />
            {format(selectedDay, 'EEEE, MMMM do, yyyy')}
            <Button variant="ghost" size="icon" onClick={() => setSelectedDay(addDays(selectedDay, 1))} className="h-6 w-6 ml-1">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </p>
        </div>
        <Button onClick={handleCreateNew} size="lg" className="rounded-full shadow-lg">
          <Plus className="w-5 h-5 mr-2" />
          Assign Appointment
        </Button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground animate-pulse">Loading schedule...</div>
      ) : employees.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/10 text-muted-foreground p-12">
           <User className="w-12 h-12 mb-4 opacity-20" />
           <p className="text-lg">No staff members found.</p>
           <p className="text-sm">Add employees first to manage their schedules.</p>
        </div>
      ) : (
        <Card className="flex-1 flex flex-col border shadow-sm overflow-hidden bg-background">
          <div className="flex-1 overflow-auto p-4 snap-y snap-proximity relative">
             <div className="min-w-[800px]">
                {/* Grid Header (Employees) */}
                <div className="flex sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b shadow-sm mb-2 rounded-t-lg">
                  <div className="w-20 shrink-0 border-r p-2 bg-muted/20 flex flex-col justify-end text-right text-xs text-muted-foreground">
                    Time
                  </div>
                  {employees.map(emp => (
                    <div key={emp.id} className="flex-1 border-r last:border-r-0 p-3 text-center font-bold text-sm bg-muted/10 truncate">
                      {emp.name || emp.email || 'Staff'}
                    </div>
                  ))}
                </div>

                {/* Grid Body (Time Slots) */}
                <div className="relative">
                  {timeSlots.map((slot, rowIndex) => (
                    <div key={`${slot.hour}:${slot.minute}`} className="flex border-b border-border/50 group h-16 hover:bg-muted/10 transition-colors">
                      {/* Time Label Column */}
                      <div className="w-20 shrink-0 border-r border-border/50 p-2 text-xs text-muted-foreground text-right sticky left-0 bg-background/95 z-10 font-medium">
                        {slot.label}
                      </div>

                      {/* Employee Columns */}
                      {employees.map(emp => {
                        // Find appointments that start in this 30 min chunk
                        const cellAppts = dailyAppointments.filter(a => {
                          const apTime = new Date(a.appointmentTime);
                          const belongsToEmp = (a.employeeId === emp.id) || (a.employee?.id === emp.id);
                          return belongsToEmp && apTime.getHours() === slot.hour && apTime.getMinutes() >= slot.minute && apTime.getMinutes() < slot.minute + 30;
                        });

                        return (
                          <div 
                            key={`${emp.id}-${slot.hour}:${slot.minute}`} 
                            className="flex-1 border-r border-border/50 last:border-r-0 relative cursor-pointer"
                            onClick={() => handleSlotClick(slot.hour, slot.minute, emp.id)}
                          >
                            {/* Render overlapping or multiple appointments in this block safely */}
                            <div className="absolute inset-1 flex flex-col gap-1 z-10 pointer-events-none">
                                {cellAppts.map(a => {
                                  return (
                                    <div 
                                      key={a.id} 
                                      className={`p-1.5 rounded-md border shadow-sm flex flex-col overflow-hidden text-xs pointer-events-auto hover:ring-2 hover:ring-primary transition-all ${a.status === 'CANCELLED' ? 'bg-destructive/10 border-destructive/20 opacity-70' : 'bg-card'}`}
                                      onClick={(e) => { e.stopPropagation(); }} // Prevent opening new modal when clicking existing appt
                                    >
                                      <div className="flex justify-between items-start gap-1">
                                         <span className="font-bold truncate" title={a.customerName}>{a.customerName}</span>
                                         {getStatusBadge(a.status)}
                                      </div>
                                      <span className="text-muted-foreground truncate">{a.service.name}</span>
                                      
                                      {/* Mini Actions if pending */}
                                      {a.status === 'PENDING' && (
                                        <div className="mt-1 flex gap-1">
                                            <Button size="icon" variant="outline" className="h-5 w-5 bg-green-50 hover:bg-green-100 text-green-600 border-green-200" onClick={(e) => handleStatusUpdate(a.id, 'APPROVED', e)}>✓</Button>
                                            <Button size="icon" variant="outline" className="h-5 w-5 bg-red-50 hover:bg-red-100 text-red-600 border-red-200" onClick={(e) => handleStatusUpdate(a.id, 'CANCELLED', e)}>✕</Button>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                            </div>

                            {/* Empty state '+' hint */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <div className="bg-primary/10 text-primary p-1 rounded backdrop-blur-sm shadow-sm scale-75">
                                 <Plus className="w-4 h-4" />
                               </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </Card>
      )}

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData}
        selectedDate={modalInitialDate}
        selectedEmployeeId={modalInitialEmployee}
      />
    </div>
  );
}
