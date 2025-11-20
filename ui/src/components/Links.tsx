import Link from './Link'
import { useLinks } from '@/contexts/LinksContext'

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

	return (
		<div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 py-4">
			{links.map((link, index) => (
				<Link
					key={link.id}
					link={link}
					isFirst={index === 0}
					isLast={index === links.length - 1}
				/>
			))}
		</div>
	)
}

export default Links
