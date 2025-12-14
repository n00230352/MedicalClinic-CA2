import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router-dom";
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
	doctor_id: z.string().min(1, "Doctor is required"),
	patient_id: z.string().min(1, "Patient is required"),
	diagnosis_id: z.string().min(1, "Diagnosis is required"),
	medication: z.string().min(1, "Medication is required"),
	dosage: z.string().min(1, "Dosage is required"),
	start_date: z.date({ required_error: "Strating date is required" }),
	end_date: z.date({ required_error: "Ending date is required" }),
});

export default function Create() {
	const navigate = useNavigate();
	const { token } = useAuth();

    

	const [doctors, setDoctors] = useState([]);
	const [patients, setPatients] = useState([]);
	const [diagnoses, setDiagnoses] = useState([]);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			doctor_id: "",
			patient_id: "",
			diagnosis_id: "",
			medication: "",
			dosage: "",
			start_date: undefined,
			end_date: undefined,
		},
		mode: "onChange",
	});

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				const res = await axios.get("/doctors", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setDoctors(res.data);
			} catch (err) {
				console.log(err);
			}
		};

		if (token) fetchDoctors();
	}, [token]);

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

	useEffect(() => {
		const fetchDiagnoses = async () => {
			try {
				const res = await axios.get("/diagnoses", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setDiagnoses(res.data);
			} catch (err) {
				console.log(err);
			}
		};

		if (token) fetchDiagnoses();
	}, [token]);

	const onSubmit = async (data) => {
		const payload = {
			doctor_id: parseInt(data.doctor_id),
			patient_id: parseInt(data.patient_id),
			diagnosis_id: parseInt(data.diagnosis_id),
			medication: data.medication,
			dosage: data.dosage,
			start_date: data.start_date ? data.start_date.toISOString().split("T")[0] : undefined,
			end_date: data.end_date ? data.end_date.toISOString().split("T")[0] : undefined,
		};

		try {
			await axios.post("/prescriptions", payload, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			navigate("/prescriptions", {
				state: {
					type: "success",
					message: "Prescription created successfully!",
				},
			});
		} catch (err) {
			console.log(err);
			console.log(err.response?.data);
		}
	};

	// const handleChange = (e) => {
	//     setForm({
	//         ...form,
	//         [e.target.name] : e.target.value
	//     });
	// };

	// const createAppointment = async () => {
	//     const token = localStorage.getItem("token");

	//     const options = {
	//         method: "POST",
	//         url: `/appointments`,
	//         headers: {
	//             Authorization: `Bearer ${token}`
	//         },
	//         data: {
	//             ...form,
	//             appointment_date: "",
	//             patient_id: parseInt(form.patient_id),
	//             doctor_id: parseInt(form.doctor_id)
	//         }
	//     };

	//     try {
	//         let response = await axios.request(options);
	//         console.log(response.data);
	//         navigate('/appointments'), { state : {
	//             type: 'success',
	//             message: `Appointment created successfully!`
	//         }};
	//     } catch (err) {
	//         console.log(err);
	//     }

	// };

	// const handleSubmit = (e) => {
	//     e.preventDefault();
	//     console.log(form);
	//     createAppointment();
	// };

	return (
		<>
			<h1>Create a new Prescription</h1>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4 max-w-sm"
			>

				{/* <Input 
                    type="text" 
                    placeholder="Appointment Date" 
                    name="appointment_date" 
                    value={form.appointment_date} 
                    onChange={handleChange} 
                /> */}
				{/* <Input 
                    className="flex flex-col gap-1"
                    type="text" 
                    placeholder="doctor ID" 
                    name="doctor_id" 
                    value={form.doctor_id} 
                    onChange={handleChange} 
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="patient ID" 
                    name="patient_id" 
                    value={form.patient_id} 
                    onChange={handleChange} 
                /> */}
				<Controller
					name="doctor_id"
					control={form.control}
					render={({ field }) => (
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Doctor</label>
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select a doctor" />
								</SelectTrigger>
								<SelectContent>
									{doctors.map((doctor) => (
										<SelectItem key={doctor.id} value={doctor.id.toString()}>
											{doctor.first_name} {doctor.last_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{form.formState.errors.doctor_id && (
								<p className="text-xs text-red-500">
									{form.formState.errors.doctor_id.message}
								</p>
							)}
						</div>
					)}
				/>

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

				<Controller
					name="diagnosis_id"
					control={form.control}
					render={({ field }) => (
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Diagnosis</label>
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select a diagnosis" />
								</SelectTrigger>
								<SelectContent>
									{diagnoses.map((diagnosis) => (
										<SelectItem
											key={diagnosis.id}
											value={diagnosis.id.toString()}
										>
											{diagnosis.condition}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{form.formState.errors.diagnosis_id && (
								<p className="text-xs text-red-500">
									{form.formState.errors.diagnosis_id.message}
								</p>
							)}
						</div>
					)}
				/>

				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium">Medication</label>
					<Input
						type="text"
						placeholder="Medication"
						{...form.register("medication")}
					/>
					{form.formState.errors.medication && (
						<p className="text-xs text-red-500">
							{form.formState.errors.medication.message}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium">Dosage</label>
					<Input
						type="text"
						placeholder="Dosage"
						{...form.register("dosage")}
					/>
					{form.formState.errors.dosage && (
						<p className="text-xs text-red-500">
							{form.formState.errors.dosage.message}
						</p>
					)}
				</div>

				<Controller
					name="start_date"
					control={form.control}
					render={({ field }) => (
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Starting Date</label>

							<Popover>
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
										onSelect={field.onChange}
										initialFocus
									/>
								</PopoverContent>
							</Popover>

							{form.formState.errors.start_date && (
								<p className="text-xs text-red-500">
									{form.formState.errors.start_date.message}
								</p>
							)}
						</div>
					)}
				/>

				<Controller
					name="end_date"
					control={form.control}
					render={({ field }) => (
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Ending Date</label>

							<Popover>
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
										onSelect={field.onChange}
										initialFocus
									/>
								</PopoverContent>
							</Popover>

							{form.formState.errors.end_date && (
								<p className="text-xs text-red-500">
									{form.formState.errors.end_date.message}
								</p>
							)}
						</div>
					)}
				/>

				<Button className="mt-4 cursor-pointer" variant="outline" type="submit">
					Submit
				</Button>
			</form>
		</>
	);
}
