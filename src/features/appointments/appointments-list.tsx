'use client';

import { useState, useEffect } from 'react';
import { appointmentsApi } from '@/lib/appointments.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, User, Scissors, Check, X, CheckCircle } from 'lucide-react';

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string | null;
  appointmentTime: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  service: {
    name: string;
    price: number;
  };
  employee: {
    user: {
      name: string;
    }
  };
}

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
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
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await appointmentsApi.updateStatus(id, status);
      toast.success(`Appointment ${status.toLowerCase()}ed`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'APPROVED': return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (loading) return <div className="p-10 text-center">Loading appointments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
      </div>

      <div className="grid gap-4">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No appointments found.
            </CardContent>
          </Card>
        ) : (
          appointments.map((apt) => (
            <Card key={apt.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold flex items-center">
                        <User className="w-5 h-5 mr-2 text-primary" />
                        {apt.customerName}
                      </h3>
                      {apt.customerPhone && (
                        <p className="text-sm text-muted-foreground ml-7">{apt.customerPhone}</p>
                      )}
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                      {format(new Date(apt.appointmentTime), 'PPP')}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      {format(new Date(apt.appointmentTime), 'p')}
                    </div>
                    <div className="flex items-center text-sm">
                      <Scissors className="w-4 h-4 mr-2 text-muted-foreground" />
                      {apt.service.name} (₹{apt.service.price})
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 mr-2 text-muted-foreground" />
                      Barber: {apt.employee.user.name}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-6 flex items-center justify-end gap-2 border-t md:border-t-0 md:border-l">
                  {apt.status === 'PENDING' && (
                    <>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}>
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" onClick={() => handleStatusUpdate(apt.id, 'APPROVED')}>
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    </>
                  )}
                  {apt.status === 'APPROVED' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}>
                        Cancel
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(apt.id, 'COMPLETED')}>
                        Mark Completed
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
