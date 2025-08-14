import { HomepageSection } from "@/types";

interface WhyUsProps {
	content: HomepageSection;
}

const WhyUs = ({ content: sectionContent }: WhyUsProps) => {
	if (!sectionContent || !sectionContent.content) {
		return null;
	}

	// The content is a simple string, not JSON.
	// We will display the title of the section and the content directly.
	const { title, content } = sectionContent;

	return (
		<div className="flex flex-col items-start justify-start gap-8 min-h-[80vh] px-[50px] lg:px-[200px]">
			<div className="flex flex-col items-start gap-2">
				<h2 className="text-4xl font-semibold">{title}</h2>
				<p
					className="text-lg"
					dangerouslySetInnerHTML={{ __html: content }}
				/>
			</div>
		</div>
	);
};

export default WhyUs;
