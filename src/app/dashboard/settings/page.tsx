/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { tenantsApi } from "@/services/tenants.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Store, Clock, Save, Link as LinkIcon, Upload, Trash2 } from "lucide-react";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [shopName, setShopName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Default to 9-5 every day
  const [hours, setHours] = useState<Record<string, { isOpen: boolean; start: string; end: string }>>(() => {
    const init: any = {};
    DAYS_OF_WEEK.forEach(day => {
      init[day] = { isOpen: true, start: "09:00", end: "17:00" };
    });
    return init;
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await tenantsApi.getSettings();
        setShopName(data.name || "");
        setSlug(data.slug || "");
        setLogoUrl(data.logoUrl || "");
        
        if (data.businessHours) {
          setHours(prev => ({ ...prev, ...data.businessHours }));
        }
      } catch (err: any) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoUrl(reader.result as string);
      toast.success("Logo selected! Click 'Save All Settings' to apply.");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await tenantsApi.updateSettings({
        name: shopName,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        logoUrl: logoUrl,
        businessHours: hours,
      });
      toast.success("Settings saved successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shop Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your brand identity, public booking URL, and operating hours.
        </p>
      </div>

      <Card className="border-border/50 shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Shop Identity
          </CardTitle>
          <CardDescription>
            This information will be displayed on your public booking page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 border-b md:border-b-0 pb-6 md:pb-0 md:border-r pr-0 md:pr-6 border-border/40">
              <div className="flex flex-col gap-3">
                <Label className="font-semibold text-foreground flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Shop Logo
                </Label>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer group"
                  >
                    {logoUrl ? (
                      <>
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </button>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    {logoUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setLogoUrl("")}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload a PNG, JPG, or WEBP image (max 2MB).
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopName" className="font-semibold text-foreground">Shop Name</Label>
                <Input 
                  id="shopName" 
                  value={shopName} 
                  onChange={(e) => setShopName(e.target.value)} 
                  placeholder="The Modern Atelier"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="font-semibold text-foreground flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" /> Public Booking URL
                </Label>
                <div className="flex items-center rounded-md border border-input shadow-sm focus-within:ring-1 focus-within:ring-ring">
                  <span className="flex items-center px-3 text-muted-foreground text-sm bg-muted/50 border-r border-input rounded-l-md truncate select-none">
                    yourdomain.com/
                  </span>
                  <input
                    type="text"
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="flex-1 h-9 px-3 bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none"
                    placeholder="modern-atelier"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Business Hours
          </CardTitle>
          <CardDescription>
            Configure the specific times your shop accepts appointments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <div 
                key={day} 
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border transition-colors ${hours[day]?.isOpen ? 'bg-background border-border shadow-sm' : 'bg-muted/30 border-dashed border-border/50 opacity-75'}`}
              >
                <div className="flex items-center gap-4 w-full sm:w-1/3 mb-4 sm:mb-0">
                  <Switch 
                    checked={hours[day]?.isOpen || false}
                    onCheckedChange={(checked: boolean) => setHours(h => ({
                      ...h,
                      [day]: { ...h[day], isOpen: checked }
                    }))}
                  />
                  <Label className={`font-semibold text-base ${!hours[day]?.isOpen ? 'text-muted-foreground line-through decoration-muted-foreground/50' : ''}`}>
                    {day}
                  </Label>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-2/3">
                  <Input 
                    type="time" 
                    value={hours[day]?.start || "09:00"}
                    disabled={!hours[day]?.isOpen}
                    onChange={(e) => setHours(h => ({
                      ...h,
                      [day]: { ...h[day], start: e.target.value }
                    }))}
                    className="bg-background disabled:opacity-50"
                  />
                  <span className="text-muted-foreground px-2">to</span>
                  <Input 
                    type="time" 
                    value={hours[day]?.end || "17:00"}
                    disabled={!hours[day]?.isOpen}
                    onChange={(e) => setHours(h => ({
                      ...h,
                      [day]: { ...h[day], end: e.target.value }
                    }))}
                    className="bg-background disabled:opacity-50"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4 pb-12">
        <Button 
          size="lg" 
          onClick={handleSave} 
          disabled={saving}
          className="w-full sm:w-auto font-bold px-8 shadow-md"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
