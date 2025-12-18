import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Phone, Plus } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

	const navigate = useNavigate();
	const { token } = useAuth();

	const unixToLocalDateString = (unixTimestamp) => {
		const date = new Date(unixTimestamp * 1000);
		return date.toLocaleDateString(); // Format the date to a readable string
	};

	useEffect(() => {
		const fetchPatients = async () => {
			const options = {
				method: "GET",
				url: "/patients",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			try {
				let response = await axios.request(options);
				console.log(response.data);
				setPatients(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchPatients();

		console.log("Hello");
	}, []);

	const onDeleteCallback = (id) => {
		toast.success("Patient deleted successfully");
		setPatients(patients.filter((patient) => patient.id !== id));
	};

	return (
		<>
			<div className="flex items-center justify-between">
				<h2 className="mb-4 ">Manage all patients</h2>
				<Button asChild variant="outline" className="mb-4">
					<Link to="/patients/create" className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
						New Patient
					</Link>
				</Button>
			</div>
			<Table>
				<TableCaption>A list of your recent invoices.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Patient</TableHead>
						<TableHead>Contact</TableHead>
						<TableHead>Date of Birth</TableHead>
						<TableHead>Address</TableHead>
						<TableHead>Actions</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{patients.map((patient) => (
						<TableRow key={patient.id}>
							<TableCell>
								<div className="flex items-center gap-2">
									<Avatar className="h-8 w-8">
										<AvatarImage
											src={patient.avatarUrl}
											alt={`${patient.first_name} ${patient.last_name}`}
										/>
										<AvatarFallback>
											{patient.first_name[0]}
											{patient.last_name[0]}
										</AvatarFallback>
									</Avatar>
									<span>
										{patient.first_name} {patient.last_name}
									</span>
								</div>
							</TableCell>
							<TableCell>
								{patient.email}
								<br />
								<a
									href={`tel:${patient.phone}`}
									className="flex items-center gap-1 text-sm hover:text-blue-600"
								>
									<Phone className="h-4 w-4" />
									<span>{patient.phone}</span>
								</a>
							</TableCell>

							<TableCell>
								{unixToLocalDateString(patient.date_of_birth)}
							</TableCell>
							<TableCell>{patient.address}</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button
										className="cursor-pointer hover:border-blue-500"
										variant="outline"
										size="icon"
										onClick={() => navigate(`/patients/${patient.id}`)}
									>
										<Eye />
									</Button>
									<Button
										className="cursor-pointer hover:border-blue-500"
										variant="outline"
										size="icon"
										onClick={() => navigate(`/patients/${patient.id}/edit`)}
									>
										<Pencil />
									</Button>
									<DeleteBtn
										onDeleteCallback={onDeleteCallback}
										resource="patients"
										id={patient.id}
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
