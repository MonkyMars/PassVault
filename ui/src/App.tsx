"use client";
import "./App.css";
import { ArrowRight, Plus, Shield, Eye, Search, X, Phone, User, Lock, Notebook, Tag } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FetchCredentials, SendCredentials } from "../lib/sendRequest";
import { Credential } from "../lib/types";
import CredentialView from "./CredentialView";

function App() {
	const [credentials, setCredentials] = useState<Credential[]>([]);
	const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [errors, setErrors] = useState<string[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [credentialSearchTerm, setCredentialSearchTerm] = useState("");
	const [activeTab, setActiveTab] = useState<"add" | "view">("view");
	const [isLoading, setIsLoading] = useState(false);

	const availableTags = [
		"personal", "work", "important", "finance", "social", "entertainment",
		"shopping", "healthcare", "education", "business", "development",
		"design", "marketing", "sales", "productivity", "communication",
		"travel", "gaming", "music", "fitness", "food", "family", "friends",
		"urgent", "archive", "temporary", "shared", "private"
	];

	const filteredTags = availableTags.filter(tag =>
		tag.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const fields: {
		name: string;
		type: string;
		label: string;
		placeholder: string;
		required: boolean;
		icon: React.ReactNode;
	}[] = [
			{
				name: "app",
				type: "text",
				label: "Application Name",
				placeholder: "e.g., Netflix, Gmail, GitHub",
				required: true,
				icon: <Phone className="w-4 h-4" />
			},
			{
				name: "username/email",
				type: "text",
				label: "Username or Email",
				placeholder: "your@email.com or username",
				required: true,
				icon: <User className="w-4 h-4" />
			},
			{
				name: "password",
				type: "text",
				label: "Password",
				placeholder: "Enter your secure password",
				required: true,
				icon: <Lock className="w-4 h-4" />
			},
			{
				name: "description",
				type: "text",
				label: "Notes (Optional)",
				placeholder: "Additional information or notes",
				required: false,
				icon: <Notebook className="w-4 h-4" />
			},
		];

	useEffect(() => {
		const fetchCredentials = async () => {
			setIsLoading(true);
			const { credentials, errors } = await FetchCredentials()
			if (errors.length > 0) {
				setErrors(errors);
				setIsLoading(false);
				return;
			}
			setCredentials(credentials);
			setFilteredCredentials(credentials);
			setIsLoading(false);
		};
		fetchCredentials()
	}, []);

	useEffect(() => {
		const filtered = credentials.filter(cred =>
			cred.app?.toLowerCase().includes(credentialSearchTerm.toLowerCase()) ||
			cred.username.toLowerCase().includes(credentialSearchTerm.toLowerCase()) ||
			cred.description?.toLowerCase().includes(credentialSearchTerm.toLowerCase()) ||
			cred.tags?.some(tag => tag.toLowerCase().includes(credentialSearchTerm.toLowerCase()))
		);
		setFilteredCredentials(filtered);
	}, [credentialSearchTerm, credentials]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const dropdown = document.getElementById('tags-dropdown');
			if (dropdown && !dropdown.contains(event.target as Node)) {
				setIsDropdownOpen(false);
				setSearchTerm('');
			}
		};

		if (isDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isDropdownOpen]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		const formData = new FormData(event.target as HTMLFormElement);
		const newCredential: Credential = {
			password: formData.get("password") as string,
			app: formData.get("app") as string,
			username: formData.get("username/email") as string,
			description: formData.get("description") as string,
		};

		newCredential.tags = tags.length > 0 ? tags : [];
		const submitResp = await SendCredentials(newCredential);

		if (submitResp.errors.length > 0) {
			setErrors(submitResp.errors);
			setIsLoading(false);
			return;
		}

		const updatedCredentials = [...credentials, newCredential];
		setCredentials(updatedCredentials);
		setFilteredCredentials(updatedCredentials);
		setErrors([]);
		setTags([]);
		(event.target as HTMLFormElement).reset();
		setIsLoading(false);
		setActiveTab("view");
	}

	return (
		<div className="min-h-screen pb-40 pt-10 bg-gradient-to-br from-gray-900 via-gray-900 to-black">
			{/* Background decorative elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
			</div>

			<div className="relative z-10">
				{/* Header */}
				<header className="pt-16 pb-8">
					<div className="container mx-auto px-6">
						<div className="text-center max-w-4xl mx-auto">
							<div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full glass">
								<Shield className="w-6 h-6 text-purple-400" />
								<span className="text-purple-400 font-medium">Secure Password Management</span>
							</div>

							<h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
								<span className="gradient-text">Pass</span>
								<span className="text-white">Vault</span>
							</h1>

							<p className="block text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
								Your local digital fortress. Store, manage, and access your credentials.
								<br />
								<strong>All while never leaving your own network.</strong>
							</p>

							{/* Tab Navigation */}
							<div className="inline-flex items-center p-2 rounded-2xl glass mb-8">
								{[
									{ id: "view", label: "View Vault", icon: Eye },
									{ id: "add", label: "Add Credential", icon: Plus }
								].map((tab) => {
									const Icon = tab.icon;
									return (
										<button
											key={tab.id}
											onClick={() => setActiveTab(tab.id as "add" | "view")}
											className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === tab.id
												? "bg-white/10 text-white shadow-lg"
												: "text-gray-400 hover:text-white hover:bg-white/5"
												}`}
										>
											<Icon className="w-4 h-4" />
											{tab.label}
										</button>
									);
								})}
							</div>
						</div>
					</div>
				</header>

				{/* Main Content */}
				<main className="container mx-auto px-6 pb-16">
					{activeTab === "view" ? (
						<div className="max-w-5xl mx-auto">
							{/* Search Bar */}
							<div className="mb-8">
								<div className="relative max-w-md mx-auto">
									<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<input
										type="text"
										placeholder="Search your vault..."
										value={credentialSearchTerm}
										onChange={(e) => setCredentialSearchTerm(e.target.value)}
										className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
									/>
									{credentialSearchTerm && (
										<button
											onClick={() => setCredentialSearchTerm("")}
											className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
										>
											<X className="w-5 h-5" />
										</button>
									)}
								</div>
							</div>

							{/* Error Display */}
							{errors.length > 0 && (
								<div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
									{errors.map((error, index) => (
										<p key={index} className="text-red-400">{error}</p>
									))}
								</div>
							)}

							{/* Credentials Grid */}
							{isLoading ? (
								<div className="text-center py-16">
									<div className="inline-block w-8 h-8 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mb-4"></div>
									<p className="text-gray-400">Loading your vault...</p>
								</div>
							) : filteredCredentials.length === 0 ? (
								<div className="text-center py-16">
									<Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
									<h3 className="text-xl font-semibold text-gray-400 mb-2">
										{credentialSearchTerm ? "No matching credentials found" : "Your vault is empty"}
									</h3>
									<p className="text-gray-500 mb-6">
										{credentialSearchTerm
											? "Try adjusting your search terms"
											: "Add your first credential to get started"
										}
									</p>
									{!credentialSearchTerm && (
										<button
											onClick={() => setActiveTab("add")}
											className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-300 btn-primary"
										>
											<Plus className="w-4 h-4" />
											Add First Credential
										</button>
									)}
								</div>
							) : (
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									{filteredCredentials.map((cred, index) => (
										<CredentialView key={index} credential={cred} />
									))}
								</div>
							)}
						</div>
					) : (
						/* Add Credential Form */
						<div className="max-w-2xl mx-auto">
							<form onSubmit={handleSubmit} className="form-bg rounded-3xl p-8 shadow-2xl">
								<div className="text-center mb-8">
									<div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-2xl mb-4">
										<Plus className="w-8 h-8 text-purple-400" />
									</div>
									<h2 className="text-3xl font-bold text-white mb-2">Add New Credential</h2>
									<p className="text-gray-400">Securely store your login information</p>
								</div>

								{/* Error Display */}
								{errors.length > 0 && (
									<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
										{errors.map((error, index) => (
											<p key={index} className="text-red-400 text-sm">{error}</p>
										))}
									</div>
								)}

								{/* Form Fields */}
								<div className="space-y-6">
									{fields.map((field) => (
										<div key={field.name}>
											<label className="flex items-center text-sm font-medium text-gray-300 mb-2">
												<span className="mr-2">{field.icon}</span>
												{field.label}
											</label>
											<input
												type={field.type}
												name={field.name}
												placeholder={field.placeholder}
												required={field.required}
												className="w-full px-3 py-[.5em] bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
											/>
										</div>
									))}

									{/* Tags Section */}
									<div>
										<label className="flex items-center text-sm font-medium text-gray-300 mb-2">
											<span className="mr-2"><Tag className="w-4 h-4 text-gray-400" /></span>
											Tags (Optional)
										</label>
										<div className="relative" id="tags-dropdown">
											<div
												className="w-full px-4 py-[.5em] bg-white/5 border border-white/10 rounded-xl cursor-pointer flex items-center justify-between focus-within:border-purple-400/50 focus-within:ring-2 focus-within:ring-purple-400/20 transition-all duration-300"
												onClick={() => setIsDropdownOpen(!isDropdownOpen)}
											>
												<span className="text-gray-300">
													{tags.length > 0 ? `${tags.length} tag${tags.length > 1 ? 's' : ''} selected` : 'Select tags...'}
												</span>
												<svg
													className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
												</svg>
											</div>

											{isDropdownOpen && (
												<div className="absolute z-20 w-full mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-hidden">
													<div className="p-3 border-b border-white/10">
														<input
															type="text"
															placeholder="Search tags..."
															value={searchTerm}
															onChange={(e) => setSearchTerm(e.target.value)}
															className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 transition-all duration-300"
															onClick={(e) => e.stopPropagation()}
														/>
													</div>
													<div className="max-h-48 overflow-y-auto">
														{filteredTags.length > 0 ? (
															filteredTags.map((tag) => (
																<div
																	key={tag}
																	className={`px-4 py-3 cursor-pointer hover:bg-white/5 flex items-center justify-between transition-colors ${tags.includes(tag) ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300'
																		}`}
																	onClick={(e) => {
																		e.stopPropagation();
																		if (tags.includes(tag)) {
																			setTags(tags.filter(t => t !== tag));
																		} else {
																			setTags([...tags, tag]);
																		}
																	}}
																>
																	<span className="capitalize">{tag}</span>
																	{tags.includes(tag) && (
																		<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																			<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
																		</svg>
																	)}
																</div>
															))
														) : (
															<div className="px-4 py-3 text-gray-500 text-center">
																No tags found
															</div>
														)}
													</div>
													{tags.length > 0 && (
														<div className="p-3 border-t border-white/10">
															<button
																type="button"
																onClick={(e) => {
																	e.stopPropagation();
																	setTags([]);
																}}
																className="text-sm text-gray-400 hover:text-white transition-colors"
															>
																Clear all selections
															</button>
														</div>
													)}
												</div>
											)}
										</div>

										{/* Selected Tags Display */}
										{tags.length > 0 && (
											<div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10">
												<p className="text-xs text-gray-400 mb-2">Selected tags ({tags.length}):</p>
												<div className="flex flex-wrap gap-2">
													{tags.map((tag, index) => (
														<span
															key={index}
															className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm border border-purple-400/30"
														>
															{tag}
															<button
																type="button"
																onClick={() => setTags(tags.filter(t => t !== tag))}
																className="ml-2 text-purple-300 hover:text-purple-100 transition-colors"
															>
																<X className="w-3 h-3" />
															</button>
														</span>
													))}
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Submit Button */}
								<button
									disabled={isLoading}
									className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-xl transition-all duration-300 btn-primary flex items-center justify-center gap-2 shadow-lg"
								>
									{isLoading ? (
										<>
											<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
											Saving...
										</>
									) : (
										<>
											<span>Save Credential</span>
											<ArrowRight className="w-5 h-5" />
										</>
									)}
								</button>
							</form>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

export default App;
