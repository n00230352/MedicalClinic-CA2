import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function Home({}) {
	const { token } = useAuth();
	const [showRegister, setShowRegister] = useState(false);

	return (
		<>
			<h1>This is Home</h1>

			{!token && (
				<div className="flex flex-col items-center">
					{!showRegister ? (
						<>
							<LoginForm />

							<p className="mt-2 text-sm">
								Don’t have an account?{" "}
								<button
									className="text-blue-600 hover:underline"
									onClick={() => setShowRegister(true)}
								>
									Register
								</button>
							</p>
						</>
					) : (
						<>
							<RegisterForm />
							<p className="mt-2 text-sm">
								Already have an account?{" "}
								<button
									className="text-blue-600 hover:underline"
									onClick={() => setShowRegister(false)}
								>
									Log in
								</button>
							</p>
						</>
					)}
				</div>
			)}
		</>
	);
}
