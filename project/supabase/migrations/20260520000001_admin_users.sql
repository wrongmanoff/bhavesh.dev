-- Admin allowlist for Bhavesh OS.
-- Insert the admin user's auth.uid() manually after running this migration.

CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE admin_users IS
  'Insert the admin auth.uid() manually after running this migration to activate admin access.';

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own admin_users row"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
