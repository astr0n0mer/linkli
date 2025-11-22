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
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { useProfile } from '@/app/contexts/ProfileContext'

interface ProfileEditFormProps {
	trigger?: React.ReactNode
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export const ProfileEditForm = ({ trigger, open: controlledOpen, onOpenChange }: ProfileEditFormProps) => {
	const { profile, updateProfile } = useProfile()
	const [internalOpen, setInternalOpen] = useState(false)

	const open = controlledOpen !== undefined ? controlledOpen : internalOpen
	const setOpen = onOpenChange || setInternalOpen

	const [bio, setBio] = useState(profile?.bio ?? '')

	const handleOpenChange = (newOpen: boolean) => {
		if (newOpen && profile) {
			setBio(profile.bio)
		}
		setOpen(newOpen)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		updateProfile({
			bio: bio.trim()
		})

		setOpen(false)
	}

	return (
		<Drawer open={open} onOpenChange={handleOpenChange}>
			{trigger && (
				<DrawerTrigger asChild>
					{trigger}
				</DrawerTrigger>
			)}
			<DrawerContent>
				<form onSubmit={handleSubmit}>
					<DrawerHeader>
						<DrawerTitle>Edit Bio</DrawerTitle>
						<DrawerDescription>
							Update your bio. Name and profile picture are managed through your account settings.
						</DrawerDescription>
					</DrawerHeader>
					<div className="px-4 space-y-4">
						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea
								id="bio"
								placeholder="Tell people about yourself..."
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								rows={6}
							/>
						</div>
					</div>
					<DrawerFooter>
						<Button type="submit">Save Changes</Button>
						<DrawerClose asChild>
							<Button variant="outline">Cancel</Button>
						</DrawerClose>
					</DrawerFooter>
				</form>
			</DrawerContent>
		</Drawer>
	)
}

export default ProfileEditForm
