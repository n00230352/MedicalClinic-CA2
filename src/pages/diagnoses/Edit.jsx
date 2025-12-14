import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
	patient_id: z.string().min(1, "Patient is required"),
	condition: z.string().min(1, "Condition is required"),
	diagnosis_date: z.date({ required_error: "Diagnosis date is required" }),
});

export default function Edit() {
	const { token } = useAuth();
	const navigate = useNavigate();
	const { id } = useParams();

	const [patients, setPatients] = useState([]);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			patient_id: "",
			condition: "",
			diagnosis_date: undefined,
		},
		mode: "onChange",
	});

	useEffect(() => {
		const fetchDiagnoses = async () => {
			const options = {
				method: "GET",
				url: `/diagnoses/${id}`,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			try {
				const response = await axios.request(options);
				const diagnoses = response.data;
				console.log("Fetched  Diagnosis:", diagnoses);

				form.reset({
					patient_id: diagnoses.patient_id?.toString() ?? "",
					condition: diagnoses.condition ?? "",
					diagnosis_date: diagnoses.diagnosis_date
						? new Date(diagnoses.diagnosis_date)
						: undefined,
				});
			} catch (err) {
				console.log(err);
			}
		};

		fetchDiagnoses();
	}, [id, token, form]);

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const res = await axios.get("/patients", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setPatients(res.data);
			} catch (err) {
				console.log(err);
			}
		};

		if (token) fetchPatients();
	}, [token]);

	// const handleChange = (e) => {
	//   setForm({
	//     ...form,
	//     [e.target.name]: e.target.value,
	//   });
	// };

	const onSubmit = async (data) => {
		console.log("Form data to submit:", data);

		const payload = {
			patient_id: parseInt(data.patient_id),
			condition: data.condition,
			diagnosis_date: data.diagnosis_date.toISOString().split("T")[0], // "YYYY-MM-DD"
		};
		console.log("Payload to send:", payload);

		try {
			await axios.patch(`/diagnoses/${id}`, payload, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			navigate("/diagnoses");
		} catch (err) {
			console.log(err);
		}
	};

	// const handleSubmit = (e) => {
	//   e.preventDefault();
	//   console.log(form);
	//   updateAppointments();
	// };
	const [dateOpen, setDateOpen] = useState(false);

	return (
		<>
			<h1>Update diagnosis</h1>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4 max-w-sm"
			>
				<Controller
					name="patient_id"
					control={form.control}
					render={({ field }) => (
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Patient</label>
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select a patient" />
								</SelectTrigger>
								<SelectContent>
									{patients.map((patient) => (
										<SelectItem key={patient.id} value={patient.id.toString()}>
											{patient.first_name} {patient.last_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{form.formState.errors.patient_id && (
								<p className="text-xs text-red-500">
									{form.formState.errors.patient_id.message}
								</p>
							)}
						</div>
					)}
				/>

				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium">Condition</label>
					<Input
						type="text"
						placeholder="Condition"
						{...form.register("condition")}
					/>
					{form.formState.errors.condition && (
						<p className="text-xs text-red-500">
							{form.formState.errors.condition.message}
						</p>
					)}
				</div>

				<Controller
					name="diagnosis_date"
					control={form.control}
					render={({ field }) => (
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Diagnosis Date</label>

							<Popover open={dateOpen} onOpenChange={setDateOpen}>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className="w-full justify-between font-normal"
									>
										{field.value
											? field.value.toLocaleDateString()
											: "Select date"}
										<ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={(date) => {
											field.onChange(date);
											setDateOpen(false);
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>

							{form.formState.errors.diagnosis_date && (
								<p className="text-xs text-red-500">
									{form.formState.errors.diagnosis_date.message}
								</p>
							)}
						</div>
					)}
				/>

				<Button
					className="mt-2 cursor-pointer self-start"
					variant="outline"
					type="submit"
				>
					Submit
				</Button>
			</form>
		</>
	);
}
