import { useState } from "react"
import type { LinkType } from "@/lib/types"
import LinkForm from "./LinkForm"
import { Button } from "@/components/ui/button"
import { useLinks } from "@/contexts/LinksContext"
import { ChevronUp, ChevronDown, Pencil, Trash2, MoreVertical, Copy, Check, Lock, Globe } from "lucide-react"
import { getLinkIcon } from "@/lib/linkIcons"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LinkProps {
	link: LinkType
	isFirst: boolean
	isLast: boolean
}

export const Link = ({ link, isFirst, isLast }: LinkProps) => {
	const { title, url, slug, visibility } = link
	const { moveLink, deleteLink, toggleLinkStatus } = useLinks()
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)
	const [showEditForm, setShowEditForm] = useState(false)
	const [copied, setCopied] = useState(false)

	const Icon = getLinkIcon(url)

	const handleCopyLink = async () => {
		const domain = window.location.origin // Gets current domain
		const fullUrl = `${domain}/${slug}`

		try {
			await navigator.clipboard.writeText(fullUrl)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
		} catch (err) {
			console.error('Failed to copy:', err)
		}
	}

	const isPrivate = visibility === 'private'

	return (
		<div className="w-full max-w-xl mx-auto relative group">
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className={`flex items-center justify-center gap-3 px-6 py-4 pr-16 bg-background border border-border rounded-lg hover:bg-accent hover:border-border transition-colors duration-200 ${
					isPrivate ? 'opacity-50' : ''
				}`}
			>
				<Icon className="h-5 w-5 flex-shrink-0" />
				<span className="font-medium text-foreground">
					{title}
				</span>
			</a>
			<div className="absolute top-0 right-0 h-full">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-full w-12 rounded-l-none hover:bg-accent">
							<MoreVertical className="h-5 w-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={handleCopyLink}>
							{copied ? (
								<Check className="h-4 w-4 mr-2 text-green-600" />
							) : (
								<Copy className="h-4 w-4 mr-2" />
							)}
							{copied ? 'Copied!' : 'Copy'}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => toggleLinkStatus(link.id)}
						>
							{visibility === 'public' ? (
								<>
									<Lock className="h-4 w-4 mr-2" />
									Make Private
								</>
							) : (
								<>
									<Globe className="h-4 w-4 mr-2" />
									Make Public
								</>
							)}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => setShowEditForm(true)}
						>
							<Pencil className="h-4 w-4 mr-2" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => moveLink(link.id, 'up')}
							disabled={isFirst}
						>
							<ChevronUp className="h-4 w-4 mr-2" />
							Move Up
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => moveLink(link.id, 'down')}
							disabled={isLast}
						>
							<ChevronDown className="h-4 w-4 mr-2" />
							Move Down
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => setShowDeleteDialog(true)}
							className="text-red-600"
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Edit Form Dialog */}
			<LinkForm
				mode="edit"
				link={link}
				open={showEditForm}
				onOpenChange={setShowEditForm}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Link</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{title}"? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								deleteLink(link.id)
								setShowDeleteDialog(false)
							}}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}

export default Link
