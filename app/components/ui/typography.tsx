import type { ReactNode } from "react"

interface TypographyH1Props extends React.HtmlHTMLAttributes<HTMLHeadingElement> {
	children: ReactNode
}

interface TypographyLeadProps extends React.HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode
}

export function TypographyH1({ children }: TypographyH1Props) {
	return (
		<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
			{children}
		</h1>
	)
}

export function TypographyLead({ children, ...props }: TypographyLeadProps) {
	return (
		<p className="text-muted-foreground text-xl" {...props}>
			{children}
		</p>
	)
}

