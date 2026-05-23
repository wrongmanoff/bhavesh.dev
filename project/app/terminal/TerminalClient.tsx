"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Terminal as TerminalIcon } from "lucide-react";
import type { LearningItem } from "@/types";

interface TerminalClientProps {
  nowData: {
    currentFocus: string;
    currentProjects: string[];
    learningRoadmap: LearningItem[];
  } | null;
  resumeUrl?: string;
}

interface CommandOutput {
  command: string;
  output: string;
  timestamp: string;
}

const DIRECTORY_COMMANDS = ["feed", "cyber", "projects", "now", "reviews", "vault", "gallery", "links", "terminal"];

function formatNowOutput(nowData: TerminalClientProps["nowData"]) {
  if (!nowData) {
    return `Current Focus
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
No live /now data available right now.
Visit /now for full details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }

  const projectLines = nowData.currentProjects.length > 0
    ? nowData.currentProjects.map((project) => `- ${project}`).join("\n")
    : "- No active projects listed";

  const roadmapLines = nowData.learningRoadmap.length > 0
    ? nowData.learningRoadmap.map((item) => `- ${item.skill} [${item.status}]`).join("\n")
    : "- No roadmap items listed";

  return `Current Focus
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${nowData.currentFocus || "No focus set"}

Active Projects
${projectLines}

Learning Roadmap
${roadmapLines}

Visit /now for full details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

export default function TerminalClient({ nowData, resumeUrl }: TerminalClientProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const commands = useMemo(
    () => ({
      help: `Available commands:
  help              - Show this help message
  whoami            - Display user information
  skills            - List technical skills
  projects          - Show projects with links
  ctf               - Recent CTF achievements
  contact           - Show contact information
  resume            - Download resume
  clear             - Clear terminal
  now               - Current focus
  cat about.txt     - Read about me
  ls                - List directories
  cd [dir]          - Navigate to directory`,

      whoami: `visitor@bhavesh
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:     Bhavesh Katragadda
Role:     Cybersecurity Student • Linux Enthusiast
Focus:    CTFs, secure systems, and documented learning
Status:   Building in public
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

      skills: `Technical Skills
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔒 Cybersecurity
     • Web App Security Fundamentals
     • Network Security & Enumeration
     • CTF practice (TryHackMe, HackTheBox)

  💻 Development
     • TypeScript, Python, Bash
     • Next.js, Supabase
     • Git / GitHub workflows

  🐧 Linux
     • Daily-driver terminal workflows
     • Shell scripting & automation
     • Basic hardening and troubleshooting
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

      projects: `Projects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚀 Bhavesh OS        - Personal digital HQ
  🔐 Security Tools    - Labs and mini utilities in progress

Visit /projects for detailed information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

      ctf: `CTF Activity
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎯 TryHackMe         - Active learner path progress
  🛡 HackTheBox        - Ongoing labs and challenges

Visit /cyber for writeups and walkthroughs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

      contact: `Contact Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📧 Email:    wrongmanoff@gmail.com
  💼 LinkedIn: https://www.linkedin.com/in/bhavesh-katragadda-oo7/
  🐙 GitHub:   https://github.com/wrongmanoff
  🐦 X:        https://x.com/wrongmanoff
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

      resume: `Opening resume...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If a new tab did not open, visit /links for direct download.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

      now: formatNowOutput(nowData),

      "cat about.txt": `About Me
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I'm Bhavesh, a cybersecurity student and Linux enthusiast
documenting my growth through projects, labs, and CTFs.

This terminal is a playful interface to explore my
digital world. Type 'help' to see available commands.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

      ls: `drwxr-xr-x  feed/       - Life feed and journal
drwxr-xr-x  cyber/      - Cybersecurity hub
drwxr-xr-x  projects/   - Project showcase
drwxr-xr-x  now/        - Current focus
drwxr-xr-x  reviews/    - Reviews and ratings
drwxr-xr-x  vault/      - Achievement vault
drwxr-xr-x  gallery/    - Visual memories
drwxr-xr-x  links/      - Link hub
drwxr-xr-x  terminal/   - This terminal`,
    }),
    [nowData]
  );

  const availableCommands = useMemo(() => Object.keys(commands), [commands]);

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

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    if (trimmedCmd === "sudo rm -rf /") {
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output: "Nice try!\nThis is a fake terminal, you can't actually destroy anything here.",
          timestamp,
        },
      ]);
      setInput("");
      return;
    }

    if (trimmedCmd === "resume") {
      if (resumeUrl) {
        window.open(resumeUrl, "_blank");
      }
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output: commands.resume,
          timestamp,
        },
      ]);
      setInput("");
      return;
    }

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
            output: "Navigating to home...",
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

    if (trimmedCmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const output = commands[trimmedCmd as keyof typeof commands] || `Command not found: ${cmd}\nType 'help' for available commands.`;
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
      const matches = availableCommands.filter((cmd) => cmd.startsWith(input.toLowerCase()));
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
        <div className="mb-8 flex items-center gap-3">
          <TerminalIcon className="text-[#00ff88]" size={24} />
          <div>
            <h1 className="text-xl font-bold text-white">Bhavesh Terminal</h1>
            <p className="text-xs text-[#6b6b6b]">Interactive terminal interface</p>
          </div>
        </div>

        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg p-4 sm:p-6 min-h-[500px] shadow-2xl">
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

        <div className="mt-4 text-center text-xs text-[#6b6b6b]">
          <p>Press <span className="text-[#00ff88]">Tab</span> for autocomplete · <span className="text-[#00ff88]">↑↓</span> for history · <span className="text-[#00ff88]">Enter</span> to execute</p>
        </div>
      </div>
    </div>
  );
}
