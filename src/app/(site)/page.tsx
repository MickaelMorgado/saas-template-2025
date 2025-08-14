"use client";

import { useState } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Benefits from "@/sections/Benefits";
import HowItWorks from "@/sections/HowItWorks";
import BeamsBackground from "@/components/ui/beams-background";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Pricing from "@/sections/Pricing";
import ContactForm from "@/components/ui/ContactForm";
import Testimonials from "@/sections/Testimonials";
import WhyUs from "@/sections/WhyUs";

export default function Home() {
	const [showContactForm, setShowContactForm] = useState(false);

	return (
		<main>
			{showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
			<div className="px-[100px]">
				<Navbar />
				<BeamsBackground>
					<div className="w-full h-[93vh] flex items-center justify-center flex-col text-center relative gap-6">
						<h1 className="text-7xl font-bold leading-snug z-10">
							All your business <br />
							expenses in one place.
						</h1>
						<p className="text-muted-foreground text-xl leading-normal z-10">
							Your one-stop finance empower platform. <br /> Manage all your business
							expenses with our supafast app.
						</p>
						<div className="flex items-center justify-center gap-6 mb-[50px] z-10">
							<Button variant="default" onClick={() => setShowContactForm(true)}>
								Get a Free Demo
							</Button>
							<Link href="/#pricing">
								<Button variant="secondary">See Pricing</Button>
							</Link>
						</div>
					</div>
				</BeamsBackground>
			</div>
			<Benefits />
			<HowItWorks />
			<WhyUs />
			<Testimonials />
			<Pricing />
			<Footer />
		</main>
	);
}
