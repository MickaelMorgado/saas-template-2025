CREATE POLICY "Allow insert access to authenticated users" ON homepage_sections FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update access to authenticated users" ON homepage_sections FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow delete access to authenticated users" ON homepage_sections FOR DELETE TO authenticated USING (true);
