import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function Index() {
	const [appointments, setAppointments] = useState([]);
	const [patients, setPatients] = useState([]);
	const [doctors, setDoctors] = useState([]);

	const navigate = useNavigate();
	const { token } = useAuth();

	const unixToLocalDateString = (unixTimestamp) => {
		const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
		return date.toLocaleDateString(); // Format the date to a readable string
	};

	useEffect(() => {
		const fetchAppointments = async () => {
			const options = {
				method: "GET",
				url: "/appointments",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			try {
				let response = await axios.request(options);
				console.log(response.data);
				setAppointments(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		const fetchPatients = async () => {
			try {
				const response = await axios.get("/patients", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setPatients(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		const fetchDoctors = async () => {
			try {
				const response = await axios.get("/doctors", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setDoctors(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchAppointments();
		fetchPatients();
		fetchDoctors();
		console.log("Hello");
	}, []);

	const getPatientName = (patientId) => {
		const patient = patients.find((p) => p.id === patientId);
		return patient ? `${patient.first_name} ${patient.last_name}` : patientId;
	};

	const getDoctorName = (doctorId) => {
		const doctor = doctors.find((d) => d.id === doctorId);
		return doctor ? `${doctor.first_name} ${doctor.last_name}` : doctorId;
	};

	const onDeleteCallback = (id) => {
		toast.success("Appointment deleted successfully");
		setAppointments(
			appointments.filter((appointment) => appointment.id !== id)
		);
	};

	return (
		<>
			<Button asChild variant="outline" className="mb-4 mr-auto block">
				<Link size="sm" to={`/appointments/create`}>
					Create Appointment
				</Link>
			</Button>

			<Table>
				<TableCaption>A list of your recent invoices.</TableCaption>
				<TableHeader>
					<TableRow>
						{/* <TableHead></TableHead> */}
						<TableHead>Appointment Date</TableHead>
						<TableHead>Doctor</TableHead>
						<TableHead>Patient</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{appointments.map((appointment) => (
						<TableRow key={appointment.id}>
							<TableCell>
								{unixToLocalDateString(appointment.appointment_date)}
							</TableCell>
							<TableCell>{getDoctorName(appointment.doctor_id)}</TableCell>
							<TableCell>{getPatientName(appointment.patient_id)}</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button
										className="cursor-pointer hover:border-blue-500"
										variant="outline"
										size="icon"
										onClick={() => navigate(`/appointments/${appointment.id}`)}
									>
										<Eye />
									</Button>
									<Button
										className="cursor-pointer hover:border-blue-500"
										variant="outline"
										size="icon"
										onClick={() =>
											navigate(`/appointments/${appointment.id}/edit`)
										}
									>
										<Pencil />
									</Button>
									<DeleteBtn
										onDeleteCallback={onDeleteCallback}
										resource="appointments"
										id={appointment.id}
									/>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
