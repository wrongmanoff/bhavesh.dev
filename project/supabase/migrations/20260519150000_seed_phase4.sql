-- Sample reviews
INSERT INTO reviews (title, category, rating, content, location, price_range, published) VALUES
(
  'Masala Dosa at local spot',
  'food',
  5,
  'Crispy, generous potato filling, coconut chutney was fire. **Would return** every weekend.',
  'Hyderabad',
  '$$',
  true
),
(
  'The Web Application Hacker''s Handbook',
  'book',
  5,
  'Dense but essential for anyone serious about web security. Pair with PortSwigger Academy labs.',
  '',
  '',
  true
);

-- Sample achievements
INSERT INTO achievements (title, type, issuer, date, description, image_url, credential_url, featured) VALUES
(
  'CompTIA Security+',
  'cert',
  'CompTIA',
  '2025-06-01',
  'Foundational cybersecurity certification covering network security, threats, and risk management.',
  '',
  '',
  true
),
(
  'CTF Club — Core Member',
  'club',
  'University Cybersecurity Club',
  '2025-01-15',
  'Active member organizing weekly CTF practice sessions and beginner workshops.',
  '',
  '',
  false
),
(
  'HackTheBox — 50 Machines',
  'badge',
  'HackTheBox',
  '2025-11-01',
  'Milestone: rooted 50 machines on HackTheBox platform.',
  '',
  'https://hackthebox.com',
  false
);
