-- Sample cybersecurity hub articles (published)
INSERT INTO cyber_posts (
  title,
  slug,
  content_md,
  category,
  tags,
  difficulty,
  platform,
  published
) VALUES
(
  'HTB Broker — Initial Access via MQTT',
  'htb-broker-mqtt',
  E'## Overview\n\n**Broker** is a HackTheBox machine that teaches MQTT misconfiguration and default credentials.\n\n## Reconnaissance\n\n```bash\nnmap -sC -sV -oA broker 10.10.11.x\n```\n\nPort 1883 (MQTT) stood out immediately.\n\n## Initial Access\n\nConnecting with `mosquitto_sub` using default credentials leaked internal topics:\n\n```bash\nmosquitto_sub -h 10.10.11.x -t "#" -u admin -P admin\n```\n\n## Lessons Learned\n\n- Always enumerate non-standard services\n- Default creds still show up in 2026\n- Document everything as you go',
  'ctf',
  ARRAY['htb', 'mqtt', 'linux'],
  'medium',
  'HackTheBox',
  true
),
(
  'Linux Privilege Escalation Cheatsheet',
  'linux-privesc-cheatsheet',
  E'## SUID Binaries\n\n```bash\nfind / -perm -4000 2>/dev/null\n```\n\n## Sudo Misconfigurations\n\n```bash\nsudo -l\n```\n\n## Kernel Exploits\n\nOnly when appropriate — always understand the impact first.\n\n### Quick Wins\n\n| Check | Command |\n|-------|--------|\n| Writable /etc/passwd | `ls -la /etc/passwd` |\n| Cron jobs | `cat /etc/crontab` |\n| Capabilities | `getcap -r / 2>/dev/null` |',
  'notes',
  ARRAY['linux', 'privesc', 'cheatsheet'],
  'beginner',
  '',
  true
),
(
  'Building a Simple Port Scanner in Python',
  'python-port-scanner',
  E'## Why I Built This\n\nI wanted a minimal scanner for CTF prep without reaching for `nmap` every time.\n\n## The Code\n\n```python\nimport socket\nfrom concurrent.futures import ThreadPoolExecutor\n\ndef scan(port, host):\n    s = socket.socket()\n    s.settimeout(0.5)\n    try:\n        s.connect((host, port))\n        print(f"[+] {port}/tcp open")\n    except Exception:\n        pass\n    finally:\n        s.close()\n```\n\n## Next Steps\n\n- Add banner grabbing\n- Export results to JSON',
  'tool',
  ARRAY['python', 'scanner', 'ctf'],
  'easy',
  '',
  true
);
