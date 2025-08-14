CREATE TABLE homepage_sections (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    cta_text TEXT,
    cta_url TEXT,
    "order" INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON homepage_sections FOR SELECT USING (true);
