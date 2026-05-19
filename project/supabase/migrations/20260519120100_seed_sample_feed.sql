-- Optional sample life feed posts (published) for demo
INSERT INTO life_feed (title, content, type, mood, tags, published) VALUES
  (
    'Shipped Phase 1 of Bhavesh OS',
    'Got the hero, life feed, and activity heatmap live. Next up: cyber hub and project showcase.',
    'productive',
    '🔥',
    ARRAY['build', 'webdev'],
    true
  ),
  (
    'HTB Machine — Broker',
    'Finally rooted **Broker** after struggling with the Go binary. Key lesson: always check for default creds in messaging systems.',
    'log',
    '🎯',
    ARRAY['ctf', 'htb', 'linux'],
    true
  ),
  (
    'Late night rabbit hole',
    'Spent 3 hours tweaking Neovim config instead of studying. Worth it? Debatable.',
    'wasted',
    '😅',
    ARRAY['linux', 'productivity'],
    true
  );
