import {
	Globe,
	Github,
	Twitter,
	Linkedin,
	Youtube,
	Facebook,
	Instagram,
	Mail,
	Phone,
	Twitch,
	Slack,
	Gitlab,
	Figma,
	Dribbble,
	Codepen,
	type LucideIcon
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
	'github.com': Github,
	'twitter.com': Twitter,
	'x.com': Twitter,
	'linkedin.com': Linkedin,
	'youtube.com': Youtube,
	'facebook.com': Facebook,
	'instagram.com': Instagram,
	'twitch.tv': Twitch,
	'slack.com': Slack,
	'gitlab.com': Gitlab,
	'figma.com': Figma,
	'dribbble.com': Dribbble,
	'codepen.io': Codepen,
	'mailto:': Mail,
	'tel:': Phone,
}

export function getLinkIcon(url: string): LucideIcon {
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
