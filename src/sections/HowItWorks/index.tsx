import { Button } from "@/components/ui/button";

const data = [
	{
		step: "01",
		title: "Create Account",
	},
	{
		step: "02",
		title: "Add Bank Account",
	},
	{
		step: "03",
		title: "Add Expenses",
	},
];

const HowItWorks: React.FC = ({}) => {
	return (
		<div className="flex flex-col items-center justify-start gap-16 min-h-[70vh] text-center py-12">
			<div className="flex flex-col items-center justify-center gap-2">
				<p className="font-semibold uppercase text-primary">How it works?</p>
				<h1 className="text-[40px] font-semibold">Few Easy Steps and Done</h1>
				<p className="text-muted-foreground">
					In just few easy step, you are all set to manage your business
					finances. <br />
					Manage all expenses with Spend.In all in one place.
				</p>
			</div>

			<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-10">
				{data.map((item, index) => (
					<div
						key={index}
						className="flex flex-col items-center justify-center gap-4 relative p-8 rounded-lg bg-card border border-border shadow-lg transform hover:scale-105 transition-transform duration-300">
						<div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary absolute -top-8">
							<p className="text-primary-foreground text-2xl font-bold">
								{item.step}
							</p>
						</div>
						<div className="h-24 w-24 rounded-lg bg-transparent"></div>
						<p className="text-lg font-semibold text-foreground">{item.title}</p>
					</div>
				))}
			</div>

			<div className="flex items-center justify-center gap-4 mt-8">
				<Button size="lg">Get a Free Demo</Button>
				<Button variant="outline" size="lg">
					See Pricing
				</Button>
			</div>
		</div>
	);
};

export default HowItWorks;
