import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Phone, Plus } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
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
	const [doctors, setDoctors] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchDoctors = async () => {
			const options = {
				method: "GET",
				url: "/doctors",
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

	const onDeleteCallback = (id) => {
		toast.success("Doctor deleted successfully");
		setDoctors(doctors.filter((doctor) => doctor.id !== id));
	};

	return (
		<>
    <div className="flex items-center justify-between">
			<h2 className="mb-4 ">Manage all doctors</h2>
			<Button asChild variant="outline" className="mb-4">
				<Link to="/doctors/create" className="inline-flex items-center gap-2">
					<Plus className="h-4 w-4" />
					New Doctor
				</Link>
			</Button>
</div>
			<Table>
				<TableCaption>A list of your recent invoices.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Doctor</TableHead>
						<TableHead>Contact</TableHead>
						<TableHead>Specialisation</TableHead>
						<TableHead>Actions</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{doctors.map((doctor) => (
						<TableRow key={doctor.id}>
							<TableCell>
								<div className="flex items-center gap-2">
									<Avatar className="h-8 w-8">
										<AvatarImage
											src={doctor.avatarUrl}
											alt={`${doctor.first_name} ${doctor.last_name}`}
										/>
										<AvatarFallback>
											{doctor.first_name[0]}
											{doctor.last_name[0]}
										</AvatarFallback>
									</Avatar>
									<span>
										Dr. {doctor.first_name} {doctor.last_name}
									</span>
								</div>
							</TableCell>

							<TableCell>
								{doctor.email}
								<br />
								<a
									href={`tel:${doctor.phone}`}
									className="flex items-center gap-1 text-sm hover:text-blue-600"
								>
									<Phone className="h-4 w-4" />
									<span>{doctor.phone}</span>
								</a>
							</TableCell>

							<TableCell>{doctor.specialisation}</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button
										className="cursor-pointer hover:border-blue-500"
										variant="outline"
										size="icon"
										onClick={() => navigate(`/doctors/${doctor.id}`)}
									>
										<Eye />
									</Button>
									<Button
										className="cursor-pointer hover:border-blue-500"
										variant="outline"
										size="icon"
										onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
									>
										<Pencil />
									</Button>
									<DeleteBtn
										onDeleteCallback={onDeleteCallback}
										resource="doctors"
										id={doctor.id}
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
