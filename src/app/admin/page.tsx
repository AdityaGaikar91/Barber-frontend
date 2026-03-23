"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin.api";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Store, Users, DollarSign, CalendarDays, UserCheck } from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getPlatformStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Shops",
      value: stats?.totalTenants || 0,
      icon: Store,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      label: "Platform Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      label: "Total Appointments",
      value: stats?.totalAppointments || 0,
      icon: CalendarDays,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      label: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: UserCheck,
      color: "text-pink-500",
      bg: "bg-pink-50 dark:bg-pink-950/30",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor all barbershops on the BarberPro platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <Card
            key={card.label}
            className="border-border/50 shadow-sm hover:shadow-md transition-shadow bg-card"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
