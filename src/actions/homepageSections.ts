"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { HomepageSection } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createHomepageSection(
  sectionData: Omit<HomepageSection, "id">
) {
  const supabase = createServerActionClient({ cookies });
  const { data, error } = await supabase
    .from("homepage_sections")
    .insert([sectionData])
    .select();

  if (error) {
    console.error("Error creating homepage section:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/(auth)/dashboard/pages");

  return { data };
}

export async function updateHomepageSection(
  id: number,
  sectionData: Partial<Omit<HomepageSection, "id">>
) {
  const supabase = createServerActionClient({ cookies });
  const { data, error } = await supabase
    .from("homepage_sections")
    .update(sectionData)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating homepage section:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/(auth)/dashboard/pages");

  return { data };
}

export async function deleteHomepageSection(id: number) {
  const supabase = createServerActionClient({ cookies });
  const { data, error } = await supabase
    .from("homepage_sections")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting homepage section:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/(auth)/dashboard/pages");

  return { data };
}
