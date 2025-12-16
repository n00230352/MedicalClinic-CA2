import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "@/config/api";
import { useState } from "react";

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

	let token = localStorage.getItem("token");

	const onDelete = async () => {
		const options = {
			method: "DELETE",
			url: `/${resource}/${id}?cascade=true`,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		try {
			let response = await axios.request(options);
			console.log(response.data);
			if (onDeleteCallback) {
				onDeleteCallback(id);
			}
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
