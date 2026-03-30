'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { appointmentsApi } from '@/services/appointments.service';
import { getEmployees, Employee } from '@/services/employees.service';
import { getServices, Service } from '@/services/services.service';
import { tenantsApi } from '@/services/tenants.service';
import { toast } from 'sonner';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedDate?: Date;
  selectedEmployeeId?: string;
}

export function AppointmentModal({ isOpen, onClose, onSuccess, selectedDate, selectedEmployeeId }: AppointmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tenantSlug, setTenantSlug] = useState<string>('');
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');

  // Setup form when opened
  useEffect(() => {
    if (isOpen) {
      if (selectedDate) {
        // Format to local datetime-local input string YYYY-MM-DDTHH:mm
        const offset = selectedDate.getTimezoneOffset();
        selectedDate.setMinutes(selectedDate.getMinutes() - offset);
        setAppointmentTime(selectedDate.toISOString().slice(0, 16));
      } else {
        setAppointmentTime('');
      }
      
      if (selectedEmployeeId) {
        setEmployeeId(selectedEmployeeId);
      } else {
        setEmployeeId('');
      }

      fetchDependencies();
    }
  }, [isOpen, selectedDate, selectedEmployeeId]);

  const fetchDependencies = async () => {
    try {
      const [fetchedServices, fetchedEmployees, settings] = await Promise.all([
        getServices(),
        getEmployees(),
        tenantsApi.getSettings(),
      ]);
      setServices(fetchedServices);
      setEmployees(fetchedEmployees);
      setTenantSlug(settings.slug);
    } catch (error) {
      toast.error('Failed to load form details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId || !employeeId || !appointmentTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Create payload logic 
      // The API expects tenantSlug, we typically derive it, but we can pass mock slug or use proper auth context.
      // Needs to hit: POST /appointments (DTO expects tenantSlug, serviceIds[], employeeId, appointmentTime, customer...)
      
      const payload = {
        tenantSlug: tenantSlug, // dynamically fetched from auth context api
        serviceIds: [serviceId],
        employeeId,
        appointmentTime: new Date(appointmentTime).toISOString(),
        customerName,
        customerPhone,
      };

      await appointmentsApi.createAppointment(payload);
      toast.success('Appointment scheduled successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to schedule appointment. This time spot may be double-booked.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input 
              placeholder="John Doe" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Customer Phone (Optional)</Label>
            <Input 
              type="tel"
              placeholder="+1234567890" 
              value={customerPhone} 
              onChange={(e) => setCustomerPhone(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Date & Time</Label>
            <Input 
              type="datetime-local" 
              value={appointmentTime} 
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Service</Label>
            <Select value={serviceId} onValueChange={setServiceId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((svc) => (
                  <SelectItem key={svc.id} value={svc.id}>
                    {svc.name} - ₹{svc.price} ({svc.duration}m)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name || emp.email || 'Unnamed Employee'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save Appointment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
