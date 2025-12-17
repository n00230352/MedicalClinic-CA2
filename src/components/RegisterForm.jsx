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

export default function RegisterForm() {
	const { onRegister } = useAuth();

	const [form, setForm] = useState({});
	const [errors, setErrors] = useState({});

	const registerSchema = z.object({
		first_name: z.string().min(2, "First name is required"),
		last_name: z.string().min(2, "Last name is required"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
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

		const result = registerSchema.safeParse(form);

		if (!result.success) {
			const fieldErrors = {};
			result.error.issues.forEach((issue) => {
				fieldErrors[issue.path[0]] = issue.message;
			});
			setErrors(fieldErrors);
			return;
		}

		const response = await onRegister(result.data);

		if (response?.msg) {
			setErrors({ general: response.msg });
		}
	};

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>Enter your details below to register</CardDescription>
			</CardHeader>

			<CardContent>
				<form onSubmit={submitForm}>
					<div className="flex flex-col gap-6">
						<div className="grid gap-2">
							<Label htmlFor="first_name">First Name</Label>
							<Input id="first_name" name="first_name" onChange={handleForm} />
							{errors.first_name && (
								<p className="text-xs text-red-500">{errors.first_name}</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="last_name">Last Name</Label>
							<Input id="last_name" name="last_name" onChange={handleForm} />
							{errors.last_name && (
								<p className="text-xs text-red-500">{errors.last_name}</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
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

			<CardFooter>
				<Button
					variant="outline"
					type="submit"
					onClick={submitForm}
					className="w-full"
				>
					Register
				</Button>
			</CardFooter>
		</Card>
	);
}
