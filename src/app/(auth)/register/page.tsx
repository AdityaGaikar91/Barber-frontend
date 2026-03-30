/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Scissors, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/services/api-client";
import { useAuthStore } from "@/store/auth.store";

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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const registerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
    shopName: z.string().min(1, { message: "Shop Name is required" }).min(2, { message: "Shop Name must be at least 2 characters" }),
    role: z.literal("OWNER"), // Hardcoded for this specific page, could be dynamic later
});

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            shopName: "",
            role: "OWNER",
        },
        mode: "onTouched",
    });

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', values);
            const data = response.data;
            
            // Auto login logic handled on backend, token returned
            useAuthStore.getState().login(data.user, data.access_token);

            toast.success("Registration successful", {
                description: "Welcome to BarberPro! Let's get your shop set up.",
            });
            router.push("/dashboard");
        } catch (error: any) {
             const message = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error("Failed to register", {
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
                    <CardTitle className="text-3xl font-bold tracking-tighter">Create an account</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="shopName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Shop Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Elite Cuts"
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
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
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
                                        Creating account...
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
                    <div className="flex justify-center items-center space-x-1">
                        <span>Already have an account?</span>
                        <Link
                            href="/login"
                            className="text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
            </motion.div>
        </div>
    );
}
