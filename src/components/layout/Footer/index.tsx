import { HomepageSection } from "@/types";

interface FooterProps {
	content: HomepageSection;
}

const Footer = ({ content: sectionContent }: FooterProps) => {
	if (!sectionContent || !sectionContent.content) {
		return null;
	}

	// The content is a simple string, not JSON.
	// We will display the title of the section and the content directly.
	const { title, content } = sectionContent;

	return (
		<footer className="bg-white dark:bg-gray-900 pt-[120px]">
			<div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
				<div className="sm:flex sm:items-center sm:justify-between">
					<span
						className="text-sm text-gray-500 sm:text-center dark:text-gray-400"
						dangerouslySetInnerHTML={{ __html: content }}></span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
