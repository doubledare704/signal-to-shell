# PRD: Signal to shell (Interactive Web Course)

## 1. Project Overview

"Signal to shell" is a web-based, interactive educational platform designed to take users from terminal basics to mastering the Gemini CLI. It uses a "Guided Shell" environment where users learn by doing, with real-time feedback and a project-based curriculum.

## 2. Core Features

### 2.1 Guided Web Shell

- **Virtual File System (VFS):** An in-memory representation of a project directory.
- **Command Emulator:** Supports standard Unix commands (`ls`, `cd`, `mkdir`, `touch`, `cat`, `grep`, `rm`) and the specialized `gemini` CLI commands.
- **State Validation:** Each lesson has a "Success Condition" (e.g., "File `config.json` must exist and contain the key `api_version`").

### 2.2 Curriculum Structure

- **Chapter 1: The Digital Foundation (Files & Formats)**
  - Intro to plain text vs. binaries.
  - The role of Markdown (.md) as AI-human glue.
- **Chapter 2: The Command Line (The Hands)**
  - Navigating the file system.
  - CRUD operations on files via terminal.
- **Chapter 3: The AI-CLI Paradigm (Agnostic Theory)**
  - Understanding the ReAct (Reason-Act) loop.
  - Writing system instructions for AI agents.
- **Chapter 4: Gemini CLI Deep Dive**
  - Tool calling and search grounding.
  - Long-context management (feeding massive folders).
  - Multi-modal capabilities (image + code).

### 2.3 The "Judge" Engine

- A background process that monitors the VFS.
- Provides immediate, non-intrusive feedback (no alerts; use terminal output or UI toasts).
- Unlocks the "Next Level" button only when conditions are met.

## 3. Technical Stack

- **Frontend:** Next.js (App Router), Tailwind CSS.
- **Terminal:** Xterm.js with custom Cyberpunk theme.
- **State Management:** Zustand or XState for course progress and VFS state.
- **AI Integration:** Gemini-2.5-Flash (via API) to simulate real CLI responses.

## 4. User Journey & Milestones

- **The Hook:** User enters a neon-lit landing page and immediately "wakes up" the terminal.
- **Foundation:** User builds the "Signal-Shell Dashboard" folder structure.
- **Integration:** User configures Gemini to "watch" the dashboard.
- **Mastery:** User uses Gemini CLI to automate a code refactor.


In **Signal to state**, the user journey is designed as an architectural ascent. We aren't just teaching "how to use a tool"; we are teaching how to transition from **static files** to **dynamic agentic workflows**.

The user starts as a **State Initiate** and ends as a **State Architect**.

---

## 🛰️ The Journey Map: From Signal to State

### **Block 1: The Atomic State (The Foundation)**

*Focus: Understanding that files are the "atoms" of AI context.*

* **Lesson 1.1: Plaintext as Truth.** Why `.md` and `.py` are the languages of the machine. The difference between structured (`JSON`) and unstructured (`TXT`) state.
* **Lesson 1.2: The Directory Hierarchy.** Visualizing the "Nexus." How to describe a folder structure so an AI "sees" your project.
* **Lesson 1.3: Hidden Configs.** The role of `.env` and `.gitignore`. Teaching the user that some signals must remain private.
* **The Milestone:** The user builds the "Cyber-Nexus" directory structure manually.

### **Block 2: The Command Stream (The Control Layer)**

*Focus: Mastering the terminal as the interface for state manipulation.*

* **Lesson 2.1: Environmental Scanning.** Using `ls -R`, `pwd`, and `cat` to audit the current state.
* **Lesson 2.2: State Modification.** `mkdir`, `touch`, and `mv`. Learning to build infrastructure through text commands.
* **Lesson 2.3: The Filter Pipe.** Using `grep` and `find`. Learning how to "distill" a large signal into the specific data an AI needs to see.
* **The Milestone:** The user performs a "Search and Destroy" mission, finding a specific bug log in a deep folder and deleting it.

### **Block 3: The Intelligence Signal (Agnostic Logic)**

*Focus: The theory of how any AI CLI "thinks" and "acts."*

* **Lesson 3.1: The ReAct Loop.** Understanding "Thought -> Action -> Observation." How the CLI decides which terminal command to run.
* **Lesson 3.2: The Brain File (`STS.md`).** Writing "System Instructions." Creating a persistent ruleset that dictates how the AI behaves (e.g., "Always use Python 3.12 syntax").
* **Lesson 3.3: Context Injection.** Learning the "Context Window" concept. How many files can you send before the signal gets noisy?
* **The Milestone:** The user writes a custom `STS.md` that forces the AI to speak and code like a specific architectural expert.

### **Block 4: The Gemini Protocol (Deep Dive)**

*Focus: Leveraging Google’s 1-Million token context and search grounding.*

* **Lesson 4.1: The Infinite Context.** Feeding an entire 50-file repository into Gemini. Understanding the "Context Cache."
* **Lesson 4.2: Grounded Signals.** Using Gemini’s built-in Search tool to fetch live documentation for libraries (like `Pydantic v2`) that were released after the model's training.
* **Lesson 4.3: Multimodal Debugging.** Passing an image (screenshot of a UI bug) via CLI and asking Gemini to fix the corresponding CSS in the "State."
* **The Milestone:** The user uses Gemini Search to fix a bug in a library that has no local documentation.

### **Block 5: Agentic Orchestration (Mastery)**

*Focus: Autonomy and high-level project management.*

* **Lesson 5.1: The MCP Server.** Connecting the terminal to a SQLite database or a Slack channel using the **Model Context Protocol**.
* **Lesson 5.2: Autonomous Mode (Yolo).** Setting boundaries for an agent. When to let it run 10 commands in a row and when to step in.
* **Lesson 5.3: Self-Healing Systems.** The final challenge: Build a script where Gemini monitors a log file, detects an error signal, and automatically writes the fix to the state.
* **The Milestone:** Completion of the "Self-Healing Cyber-Dashboard."

---

## 📈 The User Progression Experience

| Phase | User Title | UI Feeling | Key Interaction |
| --- | --- | --- | --- |
| **Block 1** | Initiate | Dark, quiet, empty. | `mkdir`, `touch` |
| **Block 2** | Operator | Blue accents, scrolling logs. | `grep`, `pipes` |
| **Block 3** | Analyst | Pink "Signal" pulses. | Writing `STS.md` |
| **Block 4** | Technologist | High-speed data streams. | Gemini `/search` |
| **Block 5** | Architect | Full-screen "State" synched. | Autonomous Agents |

---

## 🧩 Why this "Journey" works:

1. **Low Barrier:** You start with just text files—no coding required.
2. **High Ceiling:** By the end, you are working with **MCP** and **Autonomous Agents**, which is the bleeding edge of AI development.
3. **Logical Flow:** You cannot understand "Agentic Autonomy" (Block 5) if you don't understand how the AI uses terminal commands (Block 2) to change the project structure (Block 1).