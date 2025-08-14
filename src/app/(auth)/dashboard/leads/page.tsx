'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Lead } from '@/types';
import { Pencil, Trash, PlusCircle } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or anonymous key is not defined');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('leads').select('*');
      if (error) {
        throw error;
      }
      setLeads(data || []);
    } catch (err) {
      setError('Failed to fetch leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleOpenModal = (lead: Lead | null = null) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        name: lead.name,
        email: lead.email,
        company: lead.company || '',
        message: lead.message || ''
      });
    } else {
      setEditingLead(null);
      setFormData({
        name: '',
        email: '',
        company: '',
        message: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLead) {
        // Update lead
        const { error } = await supabase
          .from('leads')
          .update(formData)
          .eq('id', editingLead.id);
        if (error) throw error;
      } else {
        // Create new lead
        const { error } = await supabase.from('leads').insert([formData]);
        if (error) throw error;
      }
      fetchLeads();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save lead.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) throw error;
        fetchLeads();
      } catch (err) {
        setError('Failed to delete lead.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leads</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Lead
        </button>
      </div>
      <section className="p-6 bg-card border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Company</th>
                <th scope="col" className="px-6 py-3">Message</th>
                <th scope="col" className="px-6 py-3">Submitted At</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b">
                  <td className="px-6 py-4 font-medium text-foreground">{lead.name}</td>
                  <td className="px-6 py-4">{lead.email}</td>
                  <td className="px-6 py-4">{lead.company}</td>
                  <td className="px-6 py-4">{lead.message}</td>
                  <td className="px-6 py-4">{new Date(lead.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleOpenModal(lead)}
                      className="text-primary p-1 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id)}
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
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-card p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingLead ? 'Edit Lead' : 'New Lead'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-transparent"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-transparent"
                  rows={4}
                ></textarea>
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
                  {editingLead ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default LeadsPage;
