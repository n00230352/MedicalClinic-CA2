import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

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

import * as z from "zod";

export default function LoginForm() {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const { onLogin } = useAuth();

    const loginSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 5 characters"),
    });

    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setErrors({});

        const result = loginSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        const response = await onLogin(result.data.email, result.data.password);

        if (response?.msg) {
            setErrors({ general: response.msg });
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={submitForm}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                onChange={handleForm}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                onChange={handleForm}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {errors.general && (
                            <p className="text-sm text-red-500">{errors.general}</p>
                        )}
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex-col gap-2">
                <Button
                    variant="outline"
                    onClick={submitForm}
                    type="submit"
                    className="w-full"
                >
                    Login
                </Button>
            </CardFooter>
        </Card>
    );
}