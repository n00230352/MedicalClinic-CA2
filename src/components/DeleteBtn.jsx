import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "@/config/api";
import { useState, useEffect } from "react";

import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function DeleteBtn({ resource, id, onDeleteCallback }) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [appointments, setAppointments] = useState([]);
	const [prescriptions, setPrescriptions] = useState([]);

	const token = localStorage.getItem("token");

	// old delelete logic - would delete but only if there were no associations
	// const onDelete = async () => {
	// 	const options = {
	// 		method: "DELETE",
	// 		url: `/${resource}/${id}`,
	// 		headers: {
	// 			Authorization: `Bearer ${token}`,
	// 		},
	// 	};

	// 	try {
	// 		let response = await axios.request(options);
	// 		console.log(response.data);
	// 		if (onDeleteCallback) {
	// 			onDeleteCallback(id);
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	//when delete message get related data
	useEffect(() => {
		if (!isDeleting) return;

		//gets related appointments and prescriptions for doctors & patients
		const fetchAppointments = async () => {
			const response = await axios.get("/appointments", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setAppointments(
				response.data.filter((appointment) =>
					resource === "doctors"
						? appointment.doctor_id == id
						: appointment.patient_id == id
				)
			);
		};

		const fetchPrescriptions = async () => {
			const response = await axios.get("/prescriptions", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setPrescriptions(
				response.data.filter((prescription) =>
					resource === "doctors"
						? prescription.doctor_id == id
						: prescription.patient_id == id
				)
			);
		};

		fetchAppointments();
		fetchPrescriptions();
	}, [isDeleting]);

	// first it deletes appointment then the prescriptions and then ether the doctor or patient
	const onDelete = async () => {
		try {
			if (appointments.length > 0) {
				for (const appointment of appointments) {
					await axios.delete(`/appointments/${appointment.id}`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
				}
			}

			if (prescriptions.length > 0) {
				for (const prescription of prescriptions) {
					await axios.delete(`/prescriptions/${prescription.id}`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
				}
			}

			await axios.delete(`/${resource}/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (onDeleteCallback) {
				onDeleteCallback(id);
			}

			setIsDeleting(false);
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
			<AlertDialogTrigger asChild>
				<Button
					className="cursor-pointer text-red-500 hover:border-red-700 hover:text-red-700"
					variant="outline"
					size="icon"
					onClick={() => setIsDeleting(true)}
				>
					<Trash />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogAction
						onClick={onDelete}
						className="cursor-pointer text-red-500 border border-red-500 hover:text-red-700 hover:border-red-700 bg-transparent"
					>
						Yes
					</AlertDialogAction>

					<AlertDialogCancel
						onClick={() => setIsDeleting(false)}
						className="cursor-pointer text-slate-500 border border-slate-500 hover:text-slate-700 hover:border-slate-700"
					>
						No
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
