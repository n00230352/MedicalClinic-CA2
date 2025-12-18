import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams,  } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Show() {
	const [patients, setPatients] = useState([]);
	const [diagnosesDate, setDiagnosesDate] = useState([]);

	const { id } = useParams();
	const { token } = useAuth();

	const unixToLocalDateString = (unixTimestamp) => {
		const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
		return date.toLocaleDateString(); // Format the date to a readable string
	};

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

		console.log("diagnoses fetched");
	}, []);

	const getPatientName = (patientId) => {
		const patient = patients.find((p) => p.id === patientId);
		return patient ? `${patient.first_name} ${patient.last_name}` : patientId;
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>{diagnosesDate.condition}</CardTitle>
				<CardDescription>
					Patient: {getPatientName(diagnosesDate.patient_id)}
				</CardDescription>
				<CardDescription>
					Date: {unixToLocalDateString(diagnosesDate.diagnosis_date)}
				</CardDescription>
			</CardHeader>
			<CardFooter className="flex-col gap-2"></CardFooter>
		</Card>
	);
}
