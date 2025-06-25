import { Capitalize } from "../lib/func";
import { Credential } from "../lib/types";
import { Lock, User, StickyNote, Tag, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const CredentialView = ({ credential }: { credential: Credential }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [copiedField, setCopiedField] = useState<string | null>(null);

	const copyToClipboard = async (text: string, fieldName: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedField(fieldName);
			setTimeout(() => setCopiedField(null), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	return (
		<div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300 card-hover">
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1 min-w-0">
					<h3 className="text-xl font-bold text-white mb-1 truncate">
						{credential.app}
					</h3>
					<div className="flex items-center gap-2 text-sm text-gray-400">
						<div className="w-2 h-2 bg-green-400 rounded-full"></div>
						<span>Active</span>
					</div>
				</div>
				<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<button
						onClick={() => copyToClipboard(credential.username, 'username')}
						className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
						title="Copy username"
					>
						<User className="w-4 h-4" />
					</button>
					<button
						onClick={() => copyToClipboard(credential.password, 'password')}
						className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
						title="Copy password"
					>
						<Copy className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Credential Details */}
			<div className="space-y-4">
				{/* Username */}
				<div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
					<div className="flex items-center gap-3 flex-1 min-w-0">
						<div className="p-2 bg-blue-500/20 rounded-lg">
							<User className="w-4 h-4 text-blue-400" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Username</p>
							<p className="text-white font-medium truncate">{credential.username}</p>
						</div>
					</div>
					<button
						onClick={() => copyToClipboard(credential.username, 'username')}
						className={`p-2 rounded-lg transition-all duration-200 ${copiedField === 'username'
								? 'bg-green-500/20 text-green-400'
								: 'text-gray-400 hover:text-white hover:bg-white/10'
							}`}
						title="Copy username"
					>
						<Copy className="w-4 h-4" />
					</button>
				</div>

				{/* Password */}
				<div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
					<div className="flex items-center gap-3 flex-1 min-w-0">
						<div className="p-2 bg-purple-500/20 rounded-lg">
							<Lock className="w-4 h-4 text-purple-400" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Password</p>
							<p className="text-white font-medium font-mono">
								{showPassword ? credential.password : '••••••••••••'}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setShowPassword(!showPassword)}
							className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
							title={showPassword ? "Hide password" : "Show password"}
						>
							{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
						</button>
						<button
							onClick={() => copyToClipboard(credential.password, 'password')}
							className={`p-2 rounded-lg transition-all duration-200 ${copiedField === 'password'
									? 'bg-green-500/20 text-green-400'
									: 'text-gray-400 hover:text-white hover:bg-white/10'
								}`}
							title="Copy password"
						>
							<Copy className="w-4 h-4" />
						</button>
					</div>
				</div>

				{/* Description */}
				{credential.description && (
					<div className="p-3 bg-white/5 rounded-xl border border-white/5">
						<div className="flex items-start gap-3">
							<div className="p-2 bg-yellow-500/20 rounded-lg">
								<StickyNote className="w-4 h-4 text-yellow-400" />
							</div>
							<div className="flex-1">
								<p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Notes</p>
								<p className="text-gray-300 text-sm leading-relaxed">{credential.description}</p>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Tags */}
			{credential.tags?.length && (
				<div className="mt-6 pt-4 border-t border-white/10">
					<div className="flex items-center gap-2 mb-3">
						<Tag className="w-4 h-4 text-gray-400" />
						<span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Tags</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{credential.tags.map((tag, index) => (
							<span
								key={index}
								className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-full text-purple-300 text-xs font-medium"
							>
								{Capitalize(tag)}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Copy Success Indicator */}
			{copiedField && (
				<div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-pulse">
					✓ {copiedField === 'username' ? 'Username' : 'Password'} copied!
				</div>
			)}
		</div>
	);
};

export default CredentialView;
