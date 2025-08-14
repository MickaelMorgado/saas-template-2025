"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/../types_db";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Price = Database["public"]["Tables"]["prices"]["Row"];

const PricePlansPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/sign-in');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchPlans = async () => {
        setPlansLoading(true);
        setPlansError(null);
        try {
          const supabase = createClientComponentClient<Database>();
          const { data: productsData, error: productsError } = await supabase
            .from("products")
            .select("*")
            .order("name", { ascending: true });
          const { data: pricesData, error: pricesError } = await supabase
            .from("prices")
            .select("*")
            .order("unit_amount", { ascending: true });
          if (productsError || pricesError) {
            setPlansError(productsError?.message || pricesError?.message || "Failed to fetch plans");
          } else {
            setProducts(productsData || []);
            setPrices(pricesData || []);
          }
        } catch (err: any) {
          setPlansError(err.message);
        }
        setPlansLoading(false);
      };
      fetchPlans();
    }
  }, [user]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Price Plans Management</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Plan Management</h2>
        {plansError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{plansError}</div>
        )}
        {plansLoading ? (
          <p>Loading plans...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Plan Name</th>
                <th className="border border-gray-300 p-2 text-left">Description</th>
                <th className="border border-gray-300 p-2 text-left">Active</th>
                <th className="border border-gray-300 p-2 text-left">Prices</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="border border-gray-300 p-2">{product.name}</td>
                  <td className="border border-gray-300 p-2">{product.description}</td>
                  <td className="border border-gray-300 p-2">{product.active ? "Yes" : "No"}</td>
                  <td className="border border-gray-300 p-2">
                    <ul>
                      {prices
                        .filter((price) => price.product_id === product.id)
                        .map((price) => (
                          <li key={price.id}>
                            {price.unit_amount
                              ? `${(price.unit_amount / 100).toFixed(2)} ${price.currency?.toUpperCase()}`
                              : "Free"}{" "}
                            {price.interval ? `/${price.interval}` : ""}
                          </li>
                        ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
};

export default PricePlansPage;
