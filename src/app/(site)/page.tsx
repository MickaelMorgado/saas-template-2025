import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Benefits from "@/sections/Benefits";
import HowItWorks from "@/sections/HowItWorks";
import Pricing from "@/sections/Pricing";
import Testimonials from "@/sections/Testimonials";
import WhyUs from "@/sections/WhyUs";
import Header from "@/sections/Header";
import getHomepageSections from "@/actions/getHomepageSections";

export default async function Home() {
	const sections = await getHomepageSections();

	const getSectionContent = (name: string) => {
		const section = sections.find((s) => s.title === name);
		return section ? section : null;
	};

	const headerContent = getSectionContent("Header");
	const benefitsContent = getSectionContent("Benefits");
	const howItWorksContent = getSectionContent("HowItWorks");
	const whyUsContent = getSectionContent("WhyUs");
	const testimonialsContent = getSectionContent("Testimonials");
	const pricingContent = getSectionContent("Pricing");
	const footerContent = getSectionContent("Footer");

	return (
		<main>
			{/* {JSON.stringify(sections, null, 2)} */}
			<div className="px-[100px]">
				<Navbar />
				{headerContent && <Header content={headerContent} />}
			</div>
			{benefitsContent && <Benefits content={benefitsContent} />}
			{howItWorksContent && <HowItWorks content={howItWorksContent} />}
			{whyUsContent && <WhyUs content={whyUsContent} />}
			{testimonialsContent && <Testimonials content={testimonialsContent} />}
			{pricingContent && <Pricing content={pricingContent} />}
			{footerContent && <Footer content={footerContent} />}
		</main>
	);
}
