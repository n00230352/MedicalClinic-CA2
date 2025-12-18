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
	const [patients, setPatients] = useState([]);
	const [diagnosesDate, setDiagnosesDate] = useState([]);

	const navigate = useNavigate();
	const { token } = useAuth();

	const unixToLocalDateString = (unixTimestamp) => {
		const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
		return date.toLocaleDateString(); // Format the date to a readable string
	};

	useEffect(() => {
		const fetchDiagnoses = async () => {
			const options = {
				method: "GET",
				url: "/diagnoses",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			try {
				let response = await axios.request(options);
				console.log(response.data);
				setDiagnosesDate(response.data);
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

		fetchDiagnoses();
		fetchPatients();
		console.log("Hello");
	}, []);

	const getPatientName = (patientId) => {
		const patient = patients.find((p) => p.id === patientId);
		return patient ? `${patient.first_name} ${patient.last_name}` : patientId;
	};

	const onDeleteCallback = (id) => {
		toast.success("Diagnosis deleted successfully");
		setDiagnosesDate((prev) => prev.filter((d) => d.id !== id));
	};

	return (
		<>
			<Button asChild variant="outline" className="mb-4 mr-auto block">
				<Link size="sm" to={`/diagnoses/create`}>
					Create diagnosis
				</Link>
			</Button>

			<Table>
				<TableCaption>A list of your recent invoices.</TableCaption>
				<TableHeader>
					<TableRow>
						{/* <TableHead></TableHead> */}
						<TableHead>Patient</TableHead>
						<TableHead>Condition</TableHead>
						<TableHead>Diagnosis date</TableHead>
						<TableHead>Actions</TableHead>
						{/* <TableHead>BUTTONS</TableHead> */}
					</TableRow>
				</TableHeader>
				<TableBody>
					{diagnosesDate.map((diagnoses) => (
						<TableRow key={diagnoses.id}>
							<TableCell>{getPatientName(diagnoses.patient_id)}</TableCell>
							<TableCell>{diagnoses.condition}</TableCell>
							<TableCell>
								{unixToLocalDateString(diagnoses.diagnosis_date)}
							</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button
										className="cursor-pointer hover:border-blue-500"
										variant="outline"
										size="icon"
										onClick={() => navigate(`/diagnoses/${diagnoses.id}`)}
									>
										<Eye />
									</Button>
									<Button
										className="cursor-pointer hover:border-blue-500"
										variant="outline"
										size="icon"
										onClick={() => navigate(`/diagnoses/${diagnoses.id}/edit`)}
									>
										<Pencil />
									</Button>
									<DeleteBtn
										onDeleteCallback={onDeleteCallback}
										resource="diagnoses"
										id={diagnoses.id}
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
