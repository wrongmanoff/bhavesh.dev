"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon } from "lucide-react";

interface CommandOutput {
  command: string;
  output: string;
  timestamp: string;
}

const COMMANDS = {
  help: `Available commands:
  help              - Show this help message
  whoami            - Display user information
  skills            - List technical skills
  projects          - Show projects with links
  ctf               - Recent CTF achievements
  contact           - Show contact information
  social            - Social media links
  resume            - Download resume
  clear             - Clear terminal
  now               - Current focus
  cat about.txt     - Read about me
  ls                - List directories
  cd [dir]          - Navigate to directory`,

  whoami: `visitor@bhavesh
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:     Bhavesh Katragadda
Role:     Cybersecurity Student • Builder • Linux Enthusiast
Location: Digital HQ
Status:   Documenting the journey
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  skills: `Technical Skills
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔒 Cybersecurity
     • Penetration Testing
     • CTF (HackTheBox, TryHackMe)
     • Network Security
     • Linux Hardening

  💻 Development
     • Next.js, React, TypeScript
     • Python, Bash Scripting
     • Git, GitHub

  🐧 Linux
     • System Administration
     • Docker, Kubernetes
     • Shell Scripting
     • Security Tools

  🛠 Tools
     • Nmap, Burp Suite, Wireshark
     • Metasploit, John the Ripper
     • Vim, tmux
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  projects: `Projects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚀 Bhavesh OS        - This digital HQ
  🔐 Security Tools    - Custom security scripts
  📊 Analytics Dashboard - Data visualization
  🌐 Portfolio Sites  - Web development projects

Visit /projects for detailed information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  ctf: `CTF Achievements
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🏆 HackTheBox        - Medium difficulty machines
  🎯 TryHackMe         - 50+ rooms completed
  🔓 PicoCTF           - Top 10% finish
  📚 CTFlearn          - Advanced challenges

Visit /cyber for writeups and walkthroughs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  contact: `Contact Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📧 Email:    bhavesh@example.com
  💼 LinkedIn: linkedin.com/in/bhavesh
  🐙 GitHub:   github.com/bhavesh
  🐦 Twitter:  @bhavesh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  social: `Social Links
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🐙 GitHub    - github.com/bhavesh
  💼 LinkedIn  - linkedin.com/in/bhavesh
  🐦 Twitter   - @bhavesh
  🎮 TryHackMe - tryhackme.com/p/bhavesh
  🏠 HackTheBox- hackthebox.com/p/bhavesh

Visit /links for all links
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  resume: `Downloading resume...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Resume PDF download initiated.
Check your downloads folder.

Visit /links for direct download
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  now: `Current Focus
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Building Bhavesh OS - A complete digital HQ
Learning advanced penetration testing
Contributing to open-source security tools

Visit /now for full details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  "cat about.txt": `About Me
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I'm a cybersecurity student and builder passionate
about creating secure, elegant systems. I document
my journey through CTFs, projects, and life experiences.

This terminal is a playful interface to explore my
digital world. Type 'help' to see available commands.

Welcome to my corner of the internet.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  ls: `drwxr-xr-x  feed/       - Life feed and journal
drwxr-xr-x  cyber/      - Cybersecurity hub
drwxr-xr-x  projects/   - Project showcase
drwxr-xr-x  now/        - Current focus
drwxr-xr-x  reviews/    - Reviews and ratings
drwxr-xr-x  vault/      - Achievement vault
drwxr-xr-x  gallery/    - Visual memories
drwxr-xr-x  links/      - Link hub
drwxr-xr-x  terminal/   - This terminal
drwxr-xr-x  admin/      - Admin panel`,
};

const AVAILABLE_COMMANDS = Object.keys(COMMANDS);
const DIRECTORY_COMMANDS = ["feed", "cyber", "projects", "now", "reviews", "vault", "gallery", "links", "terminal", "admin"];

export default function TerminalPage() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    outputRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const processCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const timestamp = new Date().toLocaleTimeString();

    if (!trimmedCmd) return;

    // Add to command history
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    // Easter egg
    if (trimmedCmd === "sudo rm -rf /") {
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output: "Nice try! 😈\nThis is a fake terminal, you can't actually destroy anything here.\nBut nice hacker spirit!",
          timestamp,
        },
      ]);
      setInput("");
      return;
    }

    // cd command
    if (trimmedCmd.startsWith("cd ")) {
      const dir = trimmedCmd.slice(3).trim();
      if (DIRECTORY_COMMANDS.includes(dir)) {
        setHistory((prev) => [
          ...prev,
          {
            command: cmd,
            output: `Navigating to /${dir}...`,
            timestamp,
          },
        ]);
        setTimeout(() => {
          window.location.href = `/${dir}`;
        }, 500);
      } else if (dir === ".." || dir === "~") {
        setHistory((prev) => [
          ...prev,
          {
            command: cmd,
            output: `Navigating to home...`,
            timestamp,
          },
        ]);
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      } else {
        setHistory((prev) => [
          ...prev,
          {
            command: cmd,
            output: `cd: ${dir}: No such directory`,
            timestamp,
          },
        ]);
      }
      setInput("");
      return;
    }

    // Regular commands
    if (trimmedCmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const output = COMMANDS[trimmedCmd as keyof typeof COMMANDS] || `Command not found: ${cmd}\nType 'help' for available commands.`;

    setHistory((prev) => [...prev, { command: cmd, output, timestamp }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Tab completion
      const matches = AVAILABLE_COMMANDS.filter((cmd) => cmd.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setHistory((prev) => [
          ...prev,
          {
            command: input,
            output: matches.join("  "),
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-mono text-sm p-4 sm:p-8" onClick={() => inputRef.current?.focus()}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <TerminalIcon className="text-[#00ff88]" size={24} />
          <div>
            <h1 className="text-xl font-bold text-white">Bhavesh Terminal</h1>
            <p className="text-xs text-[#6b6b6b]">Interactive terminal interface</p>
          </div>
        </div>

        {/* Terminal Window */}
        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg p-4 sm:p-6 min-h-[500px] shadow-2xl">
          {/* Output */}
          <div className="space-y-4 mb-4">
            {history.length === 0 && (
              <div className="text-[#6b6b6b]">
                <p className="mb-2">Welcome to Bhavesh Terminal v1.0.0</p>
                <p className="mb-4">Type <span className="text-[#00ff88]">help</span> to see available commands.</p>
              </div>
            )}

            {history.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#00ff88]">visitor@bhavesh:~$</span>
                  <span className="text-white">{item.command}</span>
                </div>
                <pre className="text-[#c0c0c0] whitespace-pre-wrap pl-4 border-l-2 border-[#1e1e1e] ml-2">
                  {item.output}
                </pre>
              </div>
            ))}

            <div ref={outputRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2">
            <span className="text-[#00ff88]">visitor@bhavesh:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm"
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck={false}
            />
            <span className="w-2 h-4 bg-[#00ff88] animate-pulse" />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-[#6b6b6b]">
          <p>Press <span className="text-[#00ff88]">Tab</span> for autocomplete · <span className="text-[#00ff88]">↑↓</span> for history · <span className="text-[#00ff88]">Enter</span> to execute</p>
        </div>
      </div>
    </div>
  );
}
