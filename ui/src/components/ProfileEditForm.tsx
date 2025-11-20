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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProfile } from '@/contexts/ProfileContext'

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

	const [bio, setBio] = useState('')

	// Populate form when opening
	useEffect(() => {
		if (open) {
			setBio(profile.bio)
		}
	}, [open, profile])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		updateProfile({
			bio: bio.trim()
		})

		setOpen(false)
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
