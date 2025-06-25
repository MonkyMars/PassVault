"use client";
import "./App.css";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { FetchCredentials, SendCredentials } from "../lib/sendRequest";
import { Credential } from "../lib/types";

function App() {
	const [credentials, setCredentials] = useState<Credential[]>([]);
	const [errors, setErrors] = useState<string[]>([]);
	const fields = [
		{
			name: "password",
			type: "text",
			label: "Password",
			placeholder: "Enter your password",
			required: true,
		},
		{
			name: "app",
			type: "text",
			label: "App",
			placeholder: "Enter the app name",
			required: true,
		},
		{
			name: "username/email",
			type: "text",
			label: "Username/Email",
			placeholder: "Enter your username or email",
			required: true,
		},
		{
			name: "description",
			type: "text",
			label: "description",
			placeholder: "Enter any additional information",
			required: false,
		},
		{
			name: "tags",
			type: "text",
			label: "Tags",
			placeholder: "Enter tags for this entry",
			required: false,
		},
	];

	useEffect(() => {
		const fetchCredentials = async () => {
			const { credentials, errors } = await FetchCredentials()
			if (errors.length > 0) {
				setErrors(errors);
				return;
			}
			setCredentials(credentials);
		};
		fetchCredentials()
	}, []);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const newCredential: Credential = {
			password: formData.get("password") as string,
			app: formData.get("app") as string,
			username: formData.get("username/email") as string,
			description: formData.get("description") as string,
			tags: formData.get("tags")?.toString().split(",").map(tag => tag.trim()),
		};
		const submitResp = await SendCredentials(newCredential);
		if (submitResp.errors.length > 0) {
			setErrors(submitResp.errors);
			return;
		}
		setCredentials([...credentials, newCredential]);
		setErrors([]); // Clear any previous errors
	}

	return (
		<main className="flex flex-col items-center justify-center min-h-screen p-4">
			<h1 className="text-4xl font-bold dark:text-[rgba(255,255,255,0.7)] text-[rgba(100,100,100,0.5)]">Welcome to PassVault</h1>
			<p className="text-lg">Your secure password manager</p>
			<form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center space-y-4 border-[rgba(255,255,255,0.1)] border-1 p-6 rounded-lg shadow-xl max-w-[90%] min-w-[400px]">
				<h2 className="text-2xl font-semibold text-gray-300 mb-4">Add New Credential</h2>
				{errors.length > 0 && (
					<div className="text-red-500 mb-4">
						{errors.map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				)}
				{fields.map((field) => (
					<div key={field.name} className="w-full max-w-md">
						<label className="block mb-2 text-sm font-medium text-gray-300">
							{field.label}
						</label>
						<input
							type={field.type}
							name={field.name}
							placeholder={field.placeholder}
							required={field.required}
							className="w-full px-3 py-2 border-gray-300 focus:outline-none focus:ring-1 rounded focus:ring-blue-500 bg-black/20"
						/>
					</div>
				))}
				<button className="bg-black/30 text-white w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded hover:translate-y-[5px] transition-transform border-1 border-[rgba(255,255,255,0.1)] hover:bg-black/40">
					<span>Submit</span>
					<ArrowRight className="w-4 h-4" />
				</button>
			</form>
		</main>
	);
}

export default App;
