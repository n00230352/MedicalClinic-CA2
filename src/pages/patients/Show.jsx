import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, useNavigate } from "react-router";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Show() {
	const [patients, setPatients] = useState([]);
	const { id } = useParams();
	const { token } = useAuth();
	const navigate = useNavigate();

	const unixToLocalDateString = (unixTimestamp) => {
		const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
		return date.toLocaleDateString(); // Format the date to a readable string
	};

	useEffect(() => {
		const fetchPatients = async () => {
			const options = {
				method: "GET",
				url: `/patients/${id}`,
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

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="flex flex-row items-center gap-4">
				<Avatar className="h-14 w-14">
					<AvatarImage
						src={patients.image_path}
						alt={`${patients.first_name} ${patients.last_name}`}
					/>
					<AvatarFallback>
						{patients.first_name?.[0]}
						{patients.last_name?.[0]}
					</AvatarFallback>
				</Avatar>

				<div className="flex flex-col">
					<CardTitle className="text-xl">
						{patients.first_name} {patients.last_name}
					</CardTitle>
					<CardDescription>Patient profile</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-4">
					<p className="text-sm text-muted-foreground">Email:</p>
					<a
						href={`mailto:${patients.email}`}
						className="text-sm hover:text-blue-600 hover:underline"
					>
						{patients.email}
					</a>
				</div>

				<div className="flex items-center gap-4">
					<p className="text-sm text-muted-foreground">Phone:</p>
					<a
						href={`tel:${patients.phone}`}
						className="text-sm hover:text-blue-600 hover:underline"
					>
						{patients.phone}
					</a>
				</div>

				<div className="flex items-center gap-4">
					<p className="text-sm text-muted-foreground">Date of Birth</p>
					<p className="text-sm text-right">
						{unixToLocalDateString(patients.date_of_birth)}
					</p>
				</div>

				<div className="flex items-start gap-4">
					<p className="text-sm text-muted-foreground">Address</p>
					<p className="text-sm text-right break-words">{patients.address}</p>
				</div>
			</CardContent>

			<CardFooter className="flex justify-end gap-2">
				<Button variant="outline" onClick={() => navigate("/patients")}>
					Back to Patients
				</Button>
			</CardFooter>
		</Card>
	);
}
