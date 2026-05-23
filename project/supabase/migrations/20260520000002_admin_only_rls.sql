-- Restrict all admin-managed writes to user ids explicitly allowlisted in admin_users.

DROP POLICY IF EXISTS "Authenticated users can insert life_feed" ON life_feed;
DROP POLICY IF EXISTS "Authenticated users can update life_feed" ON life_feed;
DROP POLICY IF EXISTS "Authenticated users can delete life_feed" ON life_feed;

CREATE POLICY "Admin users can insert life_feed"
  ON life_feed FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can update life_feed"
  ON life_feed FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can delete life_feed"
  ON life_feed FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

DROP POLICY IF EXISTS "Authenticated users can insert cyber_posts" ON cyber_posts;
DROP POLICY IF EXISTS "Authenticated users can update cyber_posts" ON cyber_posts;
DROP POLICY IF EXISTS "Authenticated users can delete cyber_posts" ON cyber_posts;

CREATE POLICY "Admin users can insert cyber_posts"
  ON cyber_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can update cyber_posts"
  ON cyber_posts FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can delete cyber_posts"
  ON cyber_posts FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;

CREATE POLICY "Admin users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

DROP POLICY IF EXISTS "Authenticated users can insert now_page" ON now_page;
DROP POLICY IF EXISTS "Authenticated users can update now_page" ON now_page;
DROP POLICY IF EXISTS "Authenticated users can delete now_page" ON now_page;

CREATE POLICY "Admin users can insert now_page"
  ON now_page FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can update now_page"
  ON now_page FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can delete now_page"
  ON now_page FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can update reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON reviews;

CREATE POLICY "Admin users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

DROP POLICY IF EXISTS "Authenticated users can insert achievements" ON achievements;
DROP POLICY IF EXISTS "Authenticated users can update achievements" ON achievements;
DROP POLICY IF EXISTS "Authenticated users can delete achievements" ON achievements;

CREATE POLICY "Admin users can insert achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can update achievements"
  ON achievements FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can delete achievements"
  ON achievements FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

DROP POLICY IF EXISTS "Authenticated users can insert gallery" ON gallery;
DROP POLICY IF EXISTS "Authenticated users can update gallery" ON gallery;
DROP POLICY IF EXISTS "Authenticated users can delete gallery" ON gallery;

CREATE POLICY "Admin users can insert gallery"
  ON gallery FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can update gallery"
  ON gallery FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can delete gallery"
  ON gallery FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

DROP POLICY IF EXISTS "Authenticated users can insert links" ON links;
DROP POLICY IF EXISTS "Authenticated users can update links" ON links;
DROP POLICY IF EXISTS "Authenticated users can delete links" ON links;

CREATE POLICY "Admin users can insert links"
  ON links FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can update links"
  ON links FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "Admin users can delete links"
  ON links FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );
