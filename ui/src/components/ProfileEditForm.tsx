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
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfile } from '@/contexts/ProfileContext'
import { getInitials } from '@/lib/utils'

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

	const [fullName, setFullName] = useState('')
	const [bio, setBio] = useState('')
	const [imageUrl, setImageUrl] = useState('')

	// Populate form when opening
	useEffect(() => {
		if (open) {
			setFullName(profile.fullName)
			setBio(profile.bio)
			setImageUrl(profile.imageUrl)
		}
	}, [open, profile])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!fullName.trim()) {
			return
		}

		updateProfile({
			fullName: fullName.trim(),
			bio: bio.trim(),
			imageUrl: imageUrl.trim()
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
						<DrawerTitle>Edit Profile</DrawerTitle>
						<DrawerDescription>
							Update your profile information
						</DrawerDescription>
					</DrawerHeader>
					<div className="px-4 space-y-4">
						<div className="space-y-2 flex flex-col items-center">
							<Label>Profile Picture</Label>
							<Avatar className="w-16 h-16">
								<AvatarImage src={imageUrl} />
								<AvatarFallback className="text-2xl">
									{getInitials(fullName)}
								</AvatarFallback>
							</Avatar>
							<Input
								id="imageUrl"
								placeholder="https://example.com/image.jpg"
								value={imageUrl}
								onChange={(e) => setImageUrl(e.target.value)}
							/>
							<p className="text-xs text-muted-foreground">Enter an image URL</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="fullName">Name *</Label>
							<Input
								id="fullName"
								placeholder="Your name"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea
								id="bio"
								placeholder="Tell people about yourself..."
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								rows={4}
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
