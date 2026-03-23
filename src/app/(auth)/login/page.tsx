"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Scissors, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', values);
            const data = response.data;
            
            // Set token and user in Zustand
            useAuthStore.getState().login(data.user, data.access_token);

            toast.success("Login successful", {
                description: "Welcome back to BarberPro!",
            });
            if (data.user.role === 'SUPER_ADMIN') {
                router.push("/admin");
            } else if (data.user.role === 'EMPLOYEE') {
                router.push("/employee");
            } else {
                router.push("/dashboard");
            }
        } catch (error: any) {
             const message = error.response?.data?.message || "Please check your credentials and try again.";
            toast.error("Failed to login", {
                description: message,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
            >
                <Card className="glass border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden relative">
                    {/* Decorative background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-primary/5 blur-[80px] -z-10 rounded-full pointer-events-none" />
                    
                    <CardHeader className="space-y-2 text-center relative z-10">
                    <div className="flex justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary ring-1 ring-primary/50 shadow-[0_0_15px_var(--color-primary)]">
                            <Scissors className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tighter">Welcome back</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your email to sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="admin@barberpro.com"
                                                type="email"
                                                className="bg-background/50 border-border/50 dark:border-white/10 focus-visible:ring-primary"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="••••••••"
                                                type="password"
                                                className="bg-background/50 border-border/50 dark:border-white/10 focus-visible:ring-primary"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full shadow-lg shadow-primary/20" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
                    <div className="flex justify-center items-center space-x-1">
                        <span>Don't have an account?</span>
                        <Link
                            href="/register"
                            className="text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
            </motion.div>
        </div>
    );
}
