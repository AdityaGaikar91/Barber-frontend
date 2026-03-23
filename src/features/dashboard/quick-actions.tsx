"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, CalendarPlus, Scissors, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function QuickActionsBar() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 mt-4"
        >
            <Button asChild size="sm" variant="default" className="shadow-sm gap-1.5 rounded-full">
                <Link href="/dashboard/appointments">
                    <CalendarPlus className="h-4 w-4" />
                    Manage Appointments
                </Link>
            </Button>
            
            <Button asChild size="sm" variant="secondary" className="shadow-sm gap-1.5 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Link href="/dashboard/employees">
                    <Users className="h-4 w-4 text-blue-500" />
                    Staff Hub
                </Link>
            </Button>
            
            <Button asChild size="sm" variant="outline" className="shadow-sm gap-1.5 rounded-full">
                <Link href="/dashboard/services">
                    <Scissors className="h-4 w-4 text-pink-500" />
                    Add Service
                </Link>
            </Button>
        </motion.div>
    );
}
