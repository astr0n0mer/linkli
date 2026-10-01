import type { ComponentType } from 'react'
import { Globe, Mail, Phone } from 'lucide-react'
import {
	SiGithub,
	SiX,
	SiYoutube,
	SiFacebook,
	SiInstagram,
	SiTwitch,
	SiGitlab,
	SiFigma,
	SiDribbble,
} from '@icons-pack/react-simple-icons'

// Lucide dropped brand icons, so brands come from https://simpleicons.org/
// LinkedIn, Slack and CodePen aren't available there and fall back to Globe
type IconComponent = ComponentType<{ className?: string }>

const iconMap: Record<string, IconComponent> = {
	'github.com': SiGithub,
	'twitter.com': SiX,
	'x.com': SiX,
	'youtube.com': SiYoutube,
	'facebook.com': SiFacebook,
	'instagram.com': SiInstagram,
	'twitch.tv': SiTwitch,
	'gitlab.com': SiGitlab,
	'figma.com': SiFigma,
	'dribbble.com': SiDribbble,
	'mailto:': Mail,
	'tel:': Phone,
}

function getLinkIcon(url: string): IconComponent {
	try {
		// Handle mailto: and tel: protocols
		if (url.startsWith('mailto:')) return Mail
		if (url.startsWith('tel:')) return Phone

		// Parse URL and extract domain
		const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
		const domain = urlObj.hostname.replace('www.', '')

		// Return matched icon or Globe as fallback
		return iconMap[domain] || Globe
	} catch {
		// If URL parsing fails, return Globe
		return Globe
	}
}

interface LinkIconProps {
	url: string
	className?: string
}

/* eslint-disable react-hooks/static-components -- Dynamic icon selection based on URL is intentional */
export function LinkIcon({ url, ...props }: LinkIconProps) {
	const Icon = getLinkIcon(url)
	return <Icon {...props} />
}
/* eslint-enable react-hooks/static-components */
