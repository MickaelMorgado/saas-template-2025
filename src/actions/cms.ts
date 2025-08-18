'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabase = createServerActionClient({ cookies });

// Helper function to check for admin privileges
async function checkAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: isAdmin, error } = await supabase.rpc('is_admin');

  if (error || !isAdmin) {
    throw new Error('You do not have permission to perform this action.');
  }
  return user;
}

// Page Actions
export async function createPage(title: string, slug: string) {
  await checkAdmin();
  const { data, error } = await supabase
    .from('pages')
    .insert([{ title, slug }])
    .select();
  if (error) throw error;
  return data;
}

// Public action to get all published pages
export async function getPublishedPages() {
  const { data, error } = await supabase
    .from('pages')
    .select('title, slug')
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching published pages:', error);
    return [];
  }

  return data;
}

export async function updatePage(id: string, title: string, slug: string, is_published: boolean) {
  await checkAdmin();
  const { data, error } = await supabase
    .from('pages')
    .update({ title, slug, is_published })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

export async function deletePage(id: string) {
  await checkAdmin();
  const { error } = await supabase.from('pages').delete().eq('id', id);
  if (error) throw error;
}

export async function getPages() {
  await checkAdmin();
  const { data, error } = await supabase.from('pages').select('*');
  if (error) throw error;
  return data;
}

export async function getPageSections(page_id: string) {
  await checkAdmin();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', page_id)
    .order('order');
  if (error) throw error;
  return data;
}

// Section Actions
export async function createPageSection(page_id: string, title: string, content: string, image_url: string, cta_text: string, cta_url: string, order: number) {
  await checkAdmin();
  const { data, error } = await supabase
    .from('page_sections')
    .insert([{ page_id, title, content, image_url, cta_text, cta_url, order }])
    .select();
  if (error) throw error;
  return data;
}

export async function updatePageSection(id: string, title: string, content: string, image_url: string, cta_text: string, cta_url: string, order: number) {
  await checkAdmin();
  const { data, error } = await supabase
    .from('page_sections')
    .update({ title, content, image_url, cta_text, cta_url, order })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

export async function deletePageSection(id: string) {
  await checkAdmin();
  const { error } = await supabase.from('page_sections').delete().eq('id', id);
  if (error) throw error;
}

// Public Actions
export async function getPublishedPageBySlug(slug: string) {
  const { data, error } = await supabase
    .from("pages")
    .select("*, page_sections(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .order("order", { foreignTable: "page_sections" })
    .single();
  if (error) throw error;
  return data;
}
