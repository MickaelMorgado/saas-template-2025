import { getPublishedPageBySlug } from "@/actions/cms";
import { Tables } from "@/types_db";
import { notFound } from "next/navigation";

type PageSection = Tables<"page_sections">;

interface PageProps {
  params: {
    slug: string;
  };
}

const DynamicPage = async ({ params }: PageProps) => {
  const page = await getPublishedPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      {page.page_sections.map((section: PageSection) => (
        <section key={section.id} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
          {section.image_url && (
            <img
              src={section.image_url}
              alt={section.title}
              className="mb-4 rounded-lg"
            />
          )}
          {section.content && (
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          )}
          {section.cta_text && section.cta_url && (
            <a
              href={section.cta_url}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg mt-4 inline-block"
            >
              {section.cta_text}
            </a>
          )}
        </section>
      ))}
    </main>
  );
};

export default DynamicPage;
