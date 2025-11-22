'use client'

import { useState } from 'react'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/app/components/ui/drawer"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import type { LinkType } from '@/app/lib/types'
import { useLinks } from '@/app/contexts/LinksContext'

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
	const [title, setTitle] = useState(() => mode === 'edit' && link ? link.title : '')
	const [url, setUrl] = useState(() => mode === 'edit' && link ? link.url : '')
	const [slug, setSlug] = useState(() => mode === 'edit' && link ? link.slug : '')
	const [category, setCategory] = useState(() => mode === 'edit' && link ? link.category : '')

	const handleTitleChange = (newTitle: string) => {
		setTitle(newTitle)
		// Auto-generate slug from title in add mode
		if (mode === 'add') {
			const generatedSlug = newTitle
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '')
			setSlug(generatedSlug)
		}
	}

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
								onChange={(e) => handleTitleChange(e.target.value)}
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
