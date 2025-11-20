import { useState, useEffect } from 'react'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { LinkType } from '@/lib/types'
import { useLinks } from '@/contexts/LinksContext'

interface LinkFormProps {
	mode: 'add' | 'edit'
	link?: LinkType
	trigger?: React.ReactNode
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export const LinkForm = ({ mode, link, trigger, open: controlledOpen, onOpenChange }: LinkFormProps) => {
	const { addLink, editLink } = useLinks()
	const [internalOpen, setInternalOpen] = useState(false)

	const open = controlledOpen !== undefined ? controlledOpen : internalOpen
	const setOpen = onOpenChange || setInternalOpen
	const [title, setTitle] = useState('')
	const [url, setUrl] = useState('')
	const [slug, setSlug] = useState('')
	const [category, setCategory] = useState('')

	// Auto-generate slug from title
	useEffect(() => {
		if (mode === 'add' && title) {
			const generatedSlug = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '')
			setSlug(generatedSlug)
		}
	}, [title, mode])

	// Populate form when editing
	useEffect(() => {
		if (mode === 'edit' && link) {
			setTitle(link.title)
			setUrl(link.url)
			setSlug(link.slug)
			setCategory(link.category)
		}
	}, [mode, link, open])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!title.trim() || !url.trim() || !slug.trim()) {
			return
		}

		const data = {
			title: title.trim(),
			url: url.trim(),
			slug: slug.trim(),
			category: category.trim() || 'general',
		}

		try {
			if (mode === 'add') {
				await addLink(data)
				setTitle('')
				setUrl('')
				setSlug('')
				setCategory('')
			} else if (mode === 'edit' && link) {
				await editLink(link.id, data)
			}
			setOpen(false)
		} catch (error) {
			console.error('Error saving link:', error)
			// Error is already handled in context
		}
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			{trigger && (
				<DrawerTrigger asChild>
					{trigger}
				</DrawerTrigger>
			)}
			<DrawerContent>
				<form onSubmit={handleSubmit}>
					<DrawerHeader>
						<DrawerTitle>
							{mode === 'add' ? 'Add New Link' : 'Edit Link'}
						</DrawerTitle>
						<DrawerDescription>
							{mode === 'add'
								? 'Add a new link to your profile'
								: 'Update your link details'
							}
						</DrawerDescription>
					</DrawerHeader>
					<div className="px-4 space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title *</Label>
							<Input
								id="title"
								placeholder="My awesome link"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="url">URL *</Label>
							<Input
								id="url"
								type="url"
								placeholder="https://example.com"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="slug">Slug *</Label>
							<Input
								id="slug"
								placeholder="my-awesome-link"
								value={slug}
								onChange={(e) => setSlug(e.target.value)}
								required
							/>
							<p className="text-xs text-muted-foreground">Auto-generated from title, but you can customize it</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="category">Category</Label>
							<Input
								id="category"
								placeholder="social, work, etc."
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							/>
						</div>
					</div>
					<DrawerFooter>
						<Button type="submit">
							{mode === 'add' ? 'Add Link' : 'Save Changes'}
						</Button>
						<DrawerClose asChild>
							<Button variant="outline">Cancel</Button>
						</DrawerClose>
					</DrawerFooter>
				</form>
			</DrawerContent>
		</Drawer>
	)
}

export default LinkForm
