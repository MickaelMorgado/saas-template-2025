import getHomepageSections from "@/actions/getHomepageSections";
import Footer from "@/components/layout/Footer";
import Benefits from "@/sections/Benefits";
import Header from "@/sections/Header";
import HowItWorks from "@/sections/HowItWorks";
import Pricing from "@/sections/Pricing";
import Testimonials from "@/sections/Testimonials";
import WhyUs from "@/sections/WhyUs";

export default async function Home() {
	const sections = await getHomepageSections();

	const getSectionContent = (name: string) => {
		const section = sections.find((s) => s.title === name);
		return section ? section : null;
	};

	const headerContent = getSectionContent("Header");
	const benefitsContent = getSectionContent("Benefits");
	const howItWorksContent = getSectionContent("How It Works");
	const whyUsContent = getSectionContent("Why Us");
	const testimonialsContent = getSectionContent("Testimonials");
	const pricingContent = getSectionContent("Pricing");
	const footerContent = getSectionContent("Footer");

	return (
		<main>
			{/* <pre>{JSON.stringify(sections, null, 2)}</pre> */}
			<div>
				{headerContent && <Header content={headerContent} />}
			</div>
			{benefitsContent && <Benefits content={benefitsContent} />}
			{howItWorksContent && <HowItWorks content={howItWorksContent} />}
			{whyUsContent && <WhyUs content={whyUsContent} />}
			{testimonialsContent && <Testimonials content={testimonialsContent} />}
			{pricingContent && <Pricing content={pricingContent} />}
			<Footer />
		</main>
	);
}
