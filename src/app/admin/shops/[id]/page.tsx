"use client";

import { useState, useEffect, use } from "react";
import { adminApi } from "@/lib/admin.api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Store, Users, DollarSign, CalendarDays, Scissors } from "lucide-react";
import Link from "next/link";

export default function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getTenantDetail(id)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-20">
        <p className="text-muted-foreground text-lg">Shop not found.</p>
        <Link href="/admin/shops">
          <Button variant="outline" className="mt-4">Back to All Shops</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/shops">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          {data.logoUrl ? (
            <img src={data.logoUrl} alt={data.name} className="w-12 h-12 rounded-full object-cover border" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {data.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
            <p className="text-muted-foreground">/{data.slug || "—"} · <Badge variant="outline">{data.subscriptionTier}</Badge></p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-xl font-bold">₹{(data.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-xl font-bold">{data.employees?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Employees</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Scissors className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-xl font-bold">{data.services?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Services</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Store className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-xl font-bold">{data.users?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Users</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>All users registered under this shop.</CardDescription>
        </CardHeader>
        <CardContent>
          {data.users?.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No users found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left bg-muted/50">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Role</th>
              </tr></thead>
              <tbody>
                {data.users?.map((u: any) => (
                  <tr key={u.id} className="border-t border-border/30 hover:bg-muted/20">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3"><Badge variant="outline">{u.role}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Services */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          {data.services?.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No services configured.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.services?.map((s: any) => (
                <div key={s.id} className="p-3 rounded-lg border border-border/50 bg-muted/20 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.duration} mins</p>
                  </div>
                  <p className="font-bold">₹{s.price}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Last 20 transactions for this shop.</CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentTransactions?.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No transactions yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left bg-muted/50">
                <th className="p-3 font-semibold">Service</th>
                <th className="p-3 font-semibold text-right">Amount</th>
                <th className="p-3 font-semibold text-right">Date</th>
              </tr></thead>
              <tbody>
                {data.recentTransactions?.map((tx: any) => (
                  <tr key={tx.id} className="border-t border-border/30 hover:bg-muted/20">
                    <td className="p-3">{tx.serviceName}</td>
                    <td className="p-3 text-right font-semibold">₹{tx.amount}</td>
                    <td className="p-3 text-right text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
