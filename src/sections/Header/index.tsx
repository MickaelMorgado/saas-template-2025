"use client";

import { useState } from "react";
import Link from "next/link";
import BeamsBackground from "@/components/ui/beams-background";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ui/ContactForm";
import { HomepageSection } from "@/types";

interface HeaderProps {
	content: HomepageSection;
}

const Header = ({ content }: HeaderProps) => {
	const [showContactForm, setShowContactForm] = useState(false);

	const { title, content: description, cta_text, cta_url } = content;

	const titleParts = title ? title.split("<br />") : [];
	const descriptionParts = description ? description.split("<br />") : [];

	return (
		<>
			{showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
			<BeamsBackground>
				<div className="w-full h-[93vh] flex items-center justify-center flex-col text-center relative gap-6">
					<h1 className="text-7xl font-bold leading-snug z-10">
						{titleParts.map((part, index) => (
							<span key={index}>
								{part}
								{index < titleParts.length - 1 && <br />}
							</span>
						))}
					</h1>
					<p className="text-muted-foreground text-xl leading-normal z-10">
						{descriptionParts.map((part, index) => (
							<span key={index}>
								{part}
								{index < descriptionParts.length - 1 && <br />}
							</span>
						))}
					</p>
					<div className="flex items-center justify-center gap-6 mb-[50px] z-10">
						<Button variant="default" onClick={() => setShowContactForm(true)}>
							{cta_text || "Get a Free Demo"}
						</Button>
						<Link href={cta_url || "/#pricing"}>
							<Button variant="secondary">See Pricing</Button>
						</Link>
					</div>
				</div>
			</BeamsBackground>
		</>
	);
};

export default Header;
