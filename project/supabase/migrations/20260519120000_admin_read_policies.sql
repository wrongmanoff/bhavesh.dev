-- Allow authenticated admin users to read all rows (including drafts)

CREATE POLICY "Authenticated can read all life_feed"
  ON life_feed FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can read all cyber_posts"
  ON cyber_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can read all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);
