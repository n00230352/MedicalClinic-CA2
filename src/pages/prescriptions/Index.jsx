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
	const [prescriptions, setPrescriptions] = useState([]);
	const [patients, setPatients] = useState([]);
	const [doctors, setDoctors] = useState([]);
	const [diagnoses, setDiagnoses] = useState([]);

	const navigate = useNavigate();
	const { token } = useAuth();

	const unixToLocalDateString = (unixTimestamp) => {
		const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
		return date.toLocaleDateString(); // Format the date to a readable string
	};

	useEffect(() => {
		const fetchPrescriptions = async () => {
			const options = {
				method: "GET",
				url: "/prescriptions",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			try {
				let response = await axios.request(options);
				console.log(response.data);
				setPrescriptions(response.data);
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

		const fetchDiagnoses = async () => {
			try {
				const response = await axios.get("/diagnoses", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setDiagnoses(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchPrescriptions();
		fetchPatients();
		fetchDoctors();
		fetchDiagnoses();
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

	const getDiagnosisName = (diagnosisId) => {
		const diagnosis = diagnoses.find((d) => d.id === diagnosisId);
		return diagnosis ? `${diagnosis.condition}` : diagnosisId;
	};

	const onDeleteCallback = (id) => {
		toast.success("Appointment deleted successfully");
		setPrescriptions(
			prescriptions.filter((prescription) => prescription.id !== id)
		);
	};

	return (
		<>
			<Button asChild variant="outline" className="mb-4 mr-auto block">
				<Link size="sm" to={`/prescriptions/create`}>
					Create Prescription
				</Link>
			</Button>

			<Table>
				<TableHeader>
					<TableRow>
						{/* <TableHead></TableHead> */}

						<TableHead>Patient</TableHead>
						<TableHead>Doctor</TableHead>
						<TableHead>Diagnosis</TableHead>
						<TableHead>Medication</TableHead>
						<TableHead>Dosage</TableHead>
						<TableHead>Starting date</TableHead>
						<TableHead>Actions</TableHead>
						{/* <TableHead>BUTTONS</TableHead> */}
					</TableRow>
				</TableHeader>
				<TableBody>
					{prescriptions.map((prescription) => (
						<TableRow key={prescription.id}>
							<TableCell>{getDoctorName(prescription.doctor_id)}</TableCell>
							<TableCell>{getPatientName(prescription.patient_id)}</TableCell>

							<TableCell>
								{getDiagnosisName(prescription.diagnosis_id)}
							</TableCell>
							<TableCell>{prescription.medication}</TableCell>
							<TableCell>{prescription.dosage}</TableCell>
							<TableCell>
								{unixToLocalDateString(prescription.start_date)} - {unixToLocalDateString(prescription.end_date)}
							</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button
										className="cursor-pointer hover:border-blue-500"
										variant="outline"
										size="icon"
										onClick={() =>
											navigate(`/prescriptions/${prescription.id}`)
										}
									>
										<Eye />
									</Button>
									<Button
										className="cursor-pointer hover:border-blue-500"
										variant="outline"
										size="icon"
										onClick={() =>
											navigate(`/prescriptions/${prescription.id}/edit`)
										}
									>
										<Pencil />
									</Button>
									<DeleteBtn
										onDeleteCallback={onDeleteCallback}
										resource="prescriptions"
										id={prescription.id}
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
