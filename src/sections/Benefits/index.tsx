import { HomepageSection } from "@/types";

interface BenefitsProps {
	content: HomepageSection;
}

const Benefits = ({ content: sectionContent }: BenefitsProps) => {
	if (!sectionContent || !sectionContent.content) {
		return null;
	}

	// The content is a simple string, not JSON.
	// We will display the title of the section and the content directly.
	const { title, content } = sectionContent;

	return (
		<div className="flex flex-col items-start justify-center gap-12 min-h-[100vh] text-left px-[50px] lg:px-[200px]">
			<div className="flex flex-col items-start justify-start gap-2">
				<h1 className="text-[40px] font-semibold">{title}</h1>
				<p
					className="text-[18px] w-[500px] font-light"
					dangerouslySetInnerHTML={{ __html: content }}
				/>
			</div>
		</div>
	);
};

export default Benefits;
