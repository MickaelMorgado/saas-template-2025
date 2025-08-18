CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    cta_text TEXT,
    cta_url TEXT,
    "order" INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published pages" ON pages FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read access to sections of published pages" ON page_sections FOR SELECT USING ((SELECT is_published FROM pages WHERE id = page_id) = true);

CREATE POLICY "Allow admin full access to pages" ON pages FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Allow admin full access to page sections" ON page_sections FOR ALL USING (is_admin()) WITH CHECK (is_admin());
