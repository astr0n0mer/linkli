import Link from './Link'
import { useLinks } from '@/contexts/LinksContext'
import { LinkVisibility } from '@/lib/types'

export const Links = () => {
	const { links, loading, error } = useLinks()

	if (loading) {
		return (
			<div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 py-4">
				<div className="animate-pulse space-y-4">
					<div className="h-16 bg-gray-300 rounded" />
					<div className="h-16 bg-gray-300 rounded" />
					<div className="h-16 bg-gray-300 rounded" />
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 py-4">
				<p className="text-red-500 text-center">Error loading links: {error}</p>
			</div>
		)
	}

	if (links.length === 0) {
		return (
			<div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 py-4">
				<p className="text-muted-foreground text-center">No links yet. Add your first link!</p>
			</div>
		)
	}

	// Separate public and private links
	const publicLinks = links.filter(link => link.visibility === LinkVisibility.PUBLIC)
	const privateLinks = links.filter(link => link.visibility === LinkVisibility.PRIVATE)

	return (
		<div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 py-4">
			{/* Public Links */}
			{publicLinks.map((link, index) => (
				<Link
					key={link.id}
					link={link}
					isFirst={index === 0}
					isLast={index === publicLinks.length - 1 && privateLinks.length === 0}
				/>
			))}

			{/* Private Links */}
			{privateLinks.length > 0 && (
				<>
					<div className="flex items-center gap-2 py-2">
						<div className="flex-1 h-px bg-border" />
						<span className="text-sm text-muted-foreground">Private Links</span>
						<div className="flex-1 h-px bg-border" />
					</div>
					{privateLinks.map((link, index) => (
						<Link
							key={link.id}
							link={link}
							isFirst={false}
							isLast={index === privateLinks.length - 1}
						/>
					))}
				</>
			)}
		</div>
	)
}

export default Links
