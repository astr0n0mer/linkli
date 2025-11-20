import { TypographyH1, TypographyLead } from '@/components/ui/typography'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useProfile } from '@/contexts/ProfileContext'
import { getInitials } from '@/lib/utils'
import ProfileEditForm from './ProfileEditForm'
import { Pencil } from 'lucide-react'

export const Profile = () => {
	const { profile, loading, error } = useProfile()

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center max-w-2xl mx-auto px-4 py-8">
				<div className="animate-pulse flex flex-col items-center">
					<div className="w-24 h-24 bg-gray-300 rounded-full mb-4" />
					<div className="h-8 bg-gray-300 rounded w-48 mb-3" />
					<div className="h-6 bg-gray-300 rounded w-64" />
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center max-w-2xl mx-auto px-4 py-8">
				<p className="text-red-500">Error loading profile: {error}</p>
			</div>
		)
	}

	if (!profile) {
		return (
			<div className="flex flex-col items-center justify-center max-w-2xl mx-auto px-4 py-8">
				<p className="text-muted-foreground">No profile data</p>
			</div>
		)
	}

	const { imageUrl, firstName, lastName, bio } = profile

	return (
		<div className="flex flex-col items-center justify-center max-w-2xl mx-auto px-4 py-8">
			<Avatar className="w-24 h-24 mb-4">
				<AvatarImage src={imageUrl} />
				<AvatarFallback className="text-4xl">{getInitials(`${firstName} ${lastName}`)}</AvatarFallback>
			</Avatar>
			<TypographyH1 className="text-5xl text-center mb-3">
				{firstName} {lastName}
			</TypographyH1>
			<div className="flex items-center gap-2">
				<TypographyLead className="text-center text-lg max-w-xl">
					{bio || 'No bio yet'}
				</TypographyLead>
				<ProfileEditForm
					trigger={
						<button className="p-2 rounded-full hover:bg-accent transition-colors flex-shrink-0" aria-label="Edit bio">
							<Pencil className="h-4 w-4" />
						</button>
					}
				/>
			</div>
		</div>
	)
}

export default Profile
