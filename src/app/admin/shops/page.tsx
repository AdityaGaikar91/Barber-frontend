"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Eye, Settings } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const TIER_BADGE_MAP: Record<string, { className: string }> = {
  FREE: { className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  PRO: { className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  ENTERPRISE: { className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
};

export default function AllShopsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [changingTier, setChangingTier] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .listAllTenants()
      .then(setTenants)
      .catch(() => toast.error("Failed to load tenants"))
      .finally(() => setLoading(false));
  }, []);

  const handleTierChange = async (tenantId: string, newTier: string) => {
    setChangingTier(tenantId);
    try {
      await adminApi.updateTenantSubscription(tenantId, newTier);
      setTenants((prev) =>
        prev.map((t) =>
          t.id === tenantId ? { ...t, subscriptionTier: newTier } : t
        )
      );
      toast.success(`Subscription updated to ${newTier}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setChangingTier(null);
    }
  };

  const filtered = tenants.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.slug?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Shops</h1>
          <p className="text-muted-foreground mt-1">
            {tenants.length} registered barbershop{tenants.length !== 1 ? "s" : ""} on the platform.
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or slug..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground text-lg">
              {search ? "No shops match your search." : "No shops have registered yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="p-4 font-semibold">Shop Name</th>
                  <th className="p-4 font-semibold">Slug</th>
                  <th className="p-4 font-semibold">Tier</th>
                  <th className="p-4 font-semibold text-center">Employees</th>
                  <th className="p-4 font-semibold text-right">Revenue</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tenant, i) => (
                  <tr
                    key={tenant.id}
                    className={`border-t border-border/30 hover:bg-muted/30 transition-colors ${
                      i % 2 === 0 ? "bg-background" : "bg-muted/10"
                    }`}
                  >
                    <td className="p-4 font-medium flex items-center gap-3">
                      {tenant.logoUrl ? (
                        <img
                          src={tenant.logoUrl}
                          alt={tenant.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {tenant.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      {tenant.name}
                    </td>
                    <td className="p-4 text-muted-foreground">/{tenant.slug || "—"}</td>
                    <td className="p-4">
                      <Select
                        value={tenant.subscriptionTier}
                        onValueChange={(val) => handleTierChange(tenant.id, val)}
                        disabled={changingTier === tenant.id}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FREE">FREE</SelectItem>
                          <SelectItem value="PRO">PRO</SelectItem>
                          <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 text-center">{tenant.employeeCount}</td>
                    <td className="p-4 text-right font-semibold">
                      ₹{(tenant.revenue || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <Link href={`/admin/shops/${tenant.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
