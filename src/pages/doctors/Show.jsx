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
	const [doctors, setDoctors] = useState([]);
	const { id } = useParams();
	const { token } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchDoctors = async () => {
			const options = {
				method: "GET",
				url: `/doctors/${id}`,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			try {
				let response = await axios.request(options);
				console.log(response.data);
				setDoctors(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchDoctors();

		console.log("Hello");
	}, []);

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="flex flex-row items-center gap-4">
				<Avatar className="h-14 w-14">
					<AvatarImage
						src={doctors.image_path}
						alt={`${doctors.first_name} ${doctors.last_name}`}
					/>
					<AvatarFallback>
						{doctors.first_name?.[0]}
						{doctors.last_name?.[0]}
					</AvatarFallback>
				</Avatar>

				<div className="flex flex-col">
					<CardTitle className="text-xl">
						Dr. {doctors.first_name} {doctors.last_name}
					</CardTitle>
					<CardDescription>{doctors.specialisation}</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="space-y-2">
				<div className="text-sm">
					<span className="text-muted-foreground">Email: </span>
					<a
						href={`mailto:${doctors.email}`}
						className="hover:text-blue-600 hover:underline"
					>
						{doctors.email}
					</a>
				</div>

				<div className="text-sm">
					<span className="text-muted-foreground">Phone: </span>
					<a
						href={`tel:${doctors.phone}`}
						className="hover:text-blue-600 hover:underline"
					>
						{doctors.phone}
					</a>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end gap-2">
				<Button variant="outline" onClick={() => navigate("/doctors")}>
					Back to doctors
				</Button>
			</CardFooter>
		</Card>
	);
}
