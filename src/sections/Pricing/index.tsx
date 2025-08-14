"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useState, useEffect } from "react";
import PricingCard from "./card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/../types_db";
import { ProductWithPrice } from "@/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Price = Database["public"]["Tables"]["prices"]["Row"];

interface Pricing {
	type: string;
	icon: string;
	title: string;
	subTitle: string;
	pricing: string;
	pricingUnit: string;
	description: string;
	popular?: boolean;
	features: Feature[];
	button: string;
}

interface Feature {
	name: string;
	isIncluded: boolean;
}

const Pricing = () => {
	const [products, setProducts] = useState<ProductWithPrice[]>([]);
	const [isYearly, setIsYearly] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			setError(null);
			try {
				const supabase = createClientComponentClient<Database>();
				const { data, error } = await supabase
					.from('products')
					.select('*, prices(*)')
					.eq('active', true)
					.eq('prices.active', true)
					.order('metadata->index');

				if (error) {
					setError(error.message);
				} else {
					setProducts(data as any || []);
				}
			} catch (err: any) {
				setError(err.message);
			}
			setLoading(false);
		};
		fetchProducts();
	}, []);

	const getPricingData = (): Pricing[] => {
		return products.map(product => {
			const price = product.prices?.find(p => p.interval === (isYearly ? 'year' : 'month'));
			const iconName = product.name?.toLowerCase().replace(' plan', '') || 'free';
			return {
				type: product.name || '',
				icon: `/images/pricing/${iconName}.svg`,
				title: product.name || '',
				subTitle: product.description || '',
				pricing: price?.unit_amount ? (price.unit_amount / 100).toFixed(2) : '0',
				pricingUnit: isYearly ? '/year' : '/month',
				description: product.description || '',
				popular: product.name === 'Pro Plan',
				features: (product.metadata as any)?.features?.split(',').map((f: string) => ({ name: f, isIncluded: true })) || [],
				button: 'Get Started',
			};
		});
	};

	if (loading) {
		return <div>Loading pricing...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div
			className="flex flex-col items-center justify-center gap-2"
			id="pricing">
			<h1 className="text-3xl font-semibold">Ready to Get Started?</h1>
			<p className="text-[20px]">
				Choose a plan that suits your business needs
			</p>
			<div className="flex items-center gap-4 mt-6">
				<p className="text-[16px] font-medium">Monthly </p>
				<Switch
					checked={isYearly}
					onCheckedChange={(value) => {
						setIsYearly(value);
					}}
				/>
				<p className="text-[16px] font-medium">Yearly</p>
			</div>
			<div className="mt-2 relative">
				<Badge
					className="rounded-full bg-purple-50 px-4 py-2"
					variant="secondary">
					Save 65%
				</Badge>
				<div className="absolute top-0 right-[-50px]">
					<Image src="/images/arrow.png" alt="arrow" width={40} height={40} />
				</div>
			</div>

			<div className="flex items-start gap-6 mt-8 justify-center flex-wrap">
				{getPricingData().map((pricing, index) => {
					return <PricingCard key={index} {...pricing} />;
				})}
			</div>
		</div>
	);
};

export default Pricing;
