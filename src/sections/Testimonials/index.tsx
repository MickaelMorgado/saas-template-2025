import { HomepageSection } from "@/types";

interface TestimonialsProps {
	content: HomepageSection;
}

const Testimonials = ({ content: sectionContent }: TestimonialsProps) => {
	if (!sectionContent || !sectionContent.content) {
		return null;
	}

	// The content is a simple string, not JSON.
	// We will display the title of the section and the content directly.
	const { title, content } = sectionContent;

	return (
		<div className="flex flex-col items-center justify-start gap-16 min-h-[70vh] text-center">
			<div className="flex flex-col items-center justify-center gap-2">
				<h1 className="text-[40px] font-semibold">{title}</h1>
				<p
					className="text-slate-500"
					dangerouslySetInnerHTML={{ __html: content }}
				/>
			</div>
		</div>
	);
};

export default Testimonials;
