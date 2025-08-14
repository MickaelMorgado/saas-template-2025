"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { Pencil, Trash, PlusCircle } from "lucide-react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    active: true,
  });
  const [editingPlan, setEditingPlan] = useState<Product | null>(null);

  const supabase = createClientComponentClient<Database>();

  const fetchPlans = async () => {
    setPlansLoading(true);
    setPlansError(null);
    try {
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

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/sign-in');
    } else if (user) {
      fetchPlans();
    }
  }, [user, isLoading, router]);

  const handleOpenModal = (plan: Product | null = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        description: plan.description,
        active: plan.active,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingPlan.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(formData as Product);
        if (error) throw error;
      }
      fetchPlans();
      handleCloseModal();
    } catch (err: any) {
      setPlansError(`Failed to save plan: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this plan? This will also delete associated prices.')) {
      try {
        // First, delete associated prices
        const { error: pricesError } = await supabase.from('prices').delete().eq('product_id', id);
        if (pricesError) throw pricesError;

        // Then, delete the product
        const { error: productError } = await supabase.from('products').delete().eq('id', id);
        if (productError) throw productError;

        fetchPlans();
      } catch (err: any) {
        setPlansError(`Failed to delete plan: ${err.message}`);
      }
    }
  };

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Price Plans Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Plan
        </button>
      </div>
      
      <section className="p-6 bg-card border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Plan Management</h2>
        {plansError && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md">{plansError}</div>
        )}
        {plansLoading ? (
          <p>Loading plans...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3">Plan Name</th>
                  <th scope="col" className="px-6 py-3">Description</th>
                  <th scope="col" className="px-6 py-3">Active</th>
                  <th scope="col" className="px-6 py-3">Prices</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                    <td className="px-6 py-4">{product.description}</td>
                    <td className="px-6 py-4">{product.active ? "Yes" : "No"}</td>
                    <td className="px-6 py-4">
                      <ul className="space-y-1">
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
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-primary p-1 rounded-md hover:bg-primary/10 transition-colors"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-destructive p-1 rounded-md hover:bg-destructive/10 transition-colors"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-card p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingPlan ? 'Edit Plan' : 'New Plan'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">Plan Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-transparent"
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active || false}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="active" className="text-sm font-medium">Active</label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mr-4 px-4 py-2 rounded bg-muted text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded"
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default PricePlansPage;
