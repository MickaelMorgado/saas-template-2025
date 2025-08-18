-- Seed Pages
INSERT INTO pages (id, title, slug, is_published)
VALUES ('8a7b6c5d-4e3f-2a1b-0c9d-8e7f6a5b4c3d', 'About Us', 'about-us', true);

-- Seed Page Sections
INSERT INTO page_sections (page_id, title, content, "order")
VALUES
('8a7b6c5d-4e3f-2a1b-0c9d-8e7f6a5b4c3d', 'Our Mission', '<p>Our mission is to provide the best service possible.</p>', 1),
('8a7b6c5d-4e3f-2a1b-0c9d-8e7f6a5b4c3d', 'Our Team', '<p>We have a dedicated team of professionals.</p>', 2);
