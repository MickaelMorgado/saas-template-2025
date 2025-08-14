import { HomepageSection } from "@/types";

interface HowItWorksProps {
	content: HomepageSection;
}

const HowItWorks = ({ content: sectionContent }: HowItWorksProps) => {
	if (!sectionContent || !sectionContent.content) {
		return null;
	}

	// The content is a simple string, not JSON.
	// We will display the title of the section and the content directly.
	const { title, content } = sectionContent;

	return (
		<div className="flex flex-col items-center justify-start gap-16 min-h-[70vh] text-center py-12">
			<div className="flex flex-col items-center justify-center gap-2">
				<h1 className="text-[40px] font-semibold">{title}</h1>
				<p
					className="text-muted-foreground"
					dangerouslySetInnerHTML={{ __html: content }}
				/>
			</div>
		</div>
	);
};

export default HowItWorks;
