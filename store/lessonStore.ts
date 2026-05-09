import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DirNode, FileNode, VFSState, VFSStore, useVFSStore } from './vfsStore';

export interface SubTask {
  id: string;
  instruction: string;
  validate: (vfs: VFSState, history: VFSStore['history'], currentPath: string) => boolean;
  hint: string;
}

export type AgentStatus = 'THINKING' | 'WAITING' | 'SUCCESS' | 'ERROR';

export interface LogicStep {
  step: number;
  ai_thought: string;
  expected_action_type: string;
  required_command: string;
  hint: string;
  on_success: string;
}

export interface Lesson {
  id: string;
  blockId: string;
  title: string;
  description: string;
  example?: string;
  tasks: SubTask[];
  logicChain?: LogicStep[];
  feedback: {
    success: string;
  };
}

export interface Block {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export const BLOCKS: Block[] = [
  {
    id: "B1",
    title: "Block 1: Expectation",
    subtitle: "The Atomic State (Foundation)",
    description: "“Expectation is taking its toll...” Establish the foundation of the digital nexus."
  },
  {
    id: "B2",
    title: "Block 2: Let It Happen",
    subtitle: "The Command Stream (Control)",
    description: "“All this running around... let it happen.” Master the flow of terminal signals."
  },
  {
    id: "B3",
    title: "Block 3: Mind Mischief",
    subtitle: "The Intelligence Signal (Theory)",
    description: "“She remembers my name... but she’s only messing around.” Learn the logic of the AI loop."
  },
  {
    id: "B4",
    title: "Block 4: The Moment",
    subtitle: "The Gemini Protocol (Scale)",
    description: "“In the end, it’s eventual... and it’s right on time.” Experience the protocol at scale."
  },
  {
    id: "B5",
    title: "Block 5: Tomorrow's Dust",
    subtitle: "Agentic Orchestration (Mastery)",
    description: "“There's no use in lying... it's the air that I breathe.” Architect autonomous systems."
  }
];

export const LESSONS: Lesson[] = [
  {
    id: "L1-PWD",
    blockId: "B1",
    title: "Lesson 1: The 'pwd' Command",
    description: "Welcome, Operative. Your first task is to understand where you are. The `pwd` (print working directory) command outputs the absolute path of the current directory.",
    example: "pwd",
    tasks: [
      {
        id: "T1",
        instruction: "Run the `pwd` command.",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history[history.length - 1];
          const lastInput = history.filter(h => h.type === 'input').pop();
          return !!(lastInput && lastInput.content.endsWith('> pwd')) && !!(lastOutput && lastOutput.content === '/');
        },
        hint: "Use the command to verify your current nexus coordinates. Example: 'pwd'"
      }
    ],
    feedback: {
      success: "✓ SIGNAL_ESTABLISHED. You are currently at the root of the nexus."
    }
  },
  {
    id: "L2-LS",
    blockId: "B1",
    title: "Lesson 2: The 'ls' Command",
    description: "Now that you know where you are, let's see what is around you. The `ls` (list) command shows the contents of the current directory.",
    example: "ls",
    tasks: [
      {
        id: "T1",
        instruction: "List the contents of the current directory.",
        validate: (vfs, history, currentPath) => {
          const lastInput = history.filter(h => h.type === 'input').pop();
          return !!lastInput && lastInput.content.endsWith('> ls');
        },
        hint: "Scan the local environment for available nodes. Example: 'ls'"
      }
    ],
    feedback: {
      success: "✓ VISUALS_ONLINE. Directory contents displayed."
    }
  },
  {
    id: "L3-CD",
    blockId: "B1",
    title: "Lesson 3: The 'cd' Command",
    description: "You see the 'cyber-nexus' directory. Let's enter it. The `cd` (change directory) command allows you to navigate the file system.",
    example: "cd cyber-nexus",
    tasks: [
      {
        id: "T1",
        instruction: "Navigate into the 'cyber-nexus' directory.",
        validate: (vfs, history, currentPath) => {
          return currentPath === '/cyber-nexus';
        },
        hint: "Change your focus to a sub-directory. Example: 'cd documents'"
      }
    ],
    feedback: {
      success: "✓ ACCESS_GRANTED. You have entered the nexus."
    }
  },
  {
    id: "L4-MKDIR",
    blockId: "B1",
    title: "Lesson 4: The 'mkdir' Command",
    description: "An operative needs a place to store data. The `mkdir` (make directory) command creates a new folder.",
    example: "mkdir logs",
    tasks: [
      {
        id: "T1",
        instruction: "Create a directory named 'logs' inside 'cyber-nexus'.",
        validate: (vfs, history, currentPath) => {
          return vfs['/cyber-nexus/logs']?.type === 'dir';
        },
        hint: "Initialize a new data storage node. Example: 'mkdir archive'"
      }
    ],
    feedback: {
      success: "✓ STRUCTURE_CREATED. 'logs' directory is ready."
    }
  },
  {
    id: "L5-TOUCH",
    blockId: "B1",
    title: "Lesson 5: The 'touch' Command",
    description: "Let's create an empty file. The `touch` command creates a new, empty file if it doesn't exist.",
    example: "touch session.log",
    tasks: [
      {
        id: "T1",
        instruction: "Navigate into the 'logs' directory.",
        validate: (vfs, history, currentPath) => {
          return currentPath === '/cyber-nexus/logs';
        },
        hint: "Enter the target storage node. Example: 'cd system'"
      },
      {
        id: "T2",
        instruction: "Create a file named 'session.log'.",
        validate: (vfs, history, currentPath) => {
          return vfs['/cyber-nexus/logs/session.log']?.type === 'file';
        },
        hint: "Initialize a fresh signal record. Example: 'touch output.txt'"
      }
    ],
    feedback: {
      success: "✓ FILE_INITIALIZED. 'session.log' is ready to receive data."
    }
  },
  {
    id: "L6-RM",
    blockId: "B1",
    title: "Lesson 6: The 'rm' Command",
    description: "Sometimes data needs to be purged. The `rm` (remove) command deletes files.",
    example: "rm session.log",
    tasks: [
      {
        id: "T1",
        instruction: "Remove the 'session.log' file.",
        validate: (vfs, history, currentPath) => {
          // Verify it was created first, then removed
          const lastInput = history.filter(h => h.type === 'input').pop();
          return vfs['/cyber-nexus/logs/session.log'] === undefined && !!lastInput && lastInput.content.includes('rm session.log');
        },
        hint: "Terminate an unwanted data node. Example: 'rm cache.tmp'"
      }
    ],
    feedback: {
      success: "✓ DATA_PURGED. The file has been removed."
    }
  },
  {
    id: "L7-CP",
    blockId: "B1",
    title: "Lesson 7: The 'cp' Command",
    description: "Let's back up some data. The `cp` (copy) command copies files or directories.",
    example: "cp README.md README-backup.md",
    tasks: [
      {
        id: "T1",
        instruction: "Navigate back to the root directory.",
        validate: (vfs, history, currentPath) => {
          return currentPath === '/';
        },
        hint: "Retract your focus to the root nexus. Example: 'cd /'"
      },
      {
        id: "T2",
        instruction: "Copy 'README.md' to 'README-backup.md'.",
        validate: (vfs, history, currentPath) => {
          return vfs['/README-backup.md']?.type === 'file';
        },
        hint: "Duplicate a signal to a new location. Example: 'cp config.sys config.bak'"
      }
    ],
    feedback: {
      success: "✓ BACKUP_COMPLETE. File duplicated."
    }
  },
  {
    id: "L8-MV",
    blockId: "B1",
    title: "Lesson 8: The 'mv' Command",
    description: "Sometimes files need a new name or location. The `mv` (move) command renames or moves files.",
    example: "mv README-backup.md README-old.md",
    tasks: [
      {
        id: "T1",
        instruction: "Rename 'README-backup.md' to 'README-old.md'.",
        validate: (vfs, history, currentPath) => {
          return vfs['/README-old.md']?.type === 'file' && vfs['/README-backup.md'] === undefined;
        },
        hint: "Relocate or re-label a data stream. Example: 'mv data.raw data.processed'"
      }
    ],
    feedback: {
      success: "✓ FILE_RENAMED. The basic training is now complete, Operative."
    }
  },
  {
    id: "L2-1-SENSORY",
    blockId: "B2",
    title: "Lesson 2.1: Sensory Input",
    description: "Master the art of environmental scanning. In complex systems, you must visualize the entire hierarchy to understand the state. Use recursive tools to map the nexus.",
    example: "find /src | wc -l",
    tasks: [
      {
        id: "T1",
        instruction: "Identify the deepest nested file in the '/src' directory and output its line count using a pipe.",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history[history.length - 1];
          const lastInput = history.filter(h => h.type === 'input').pop();
          // Check for find/ls -R and wc -l in a pipe
          const isPipe = lastInput?.content.includes('|') && lastInput?.content.includes('wc -l');
          const isTarget = lastInput?.content.includes('api.py');
          const correctCount = lastOutput?.content === '11';
          return !!(isPipe && isTarget && correctCount);
        },
        hint: "Discover the architecture's depth and quantify its complexity. Example: 'find . -name \"*.txt\" | wc -l'"
      }
    ],
    feedback: {
      success: "✓ SCAN_COMPLETE. Deep state context acquired."
    }
  },
  {
    id: "L2-2-STRUCTURAL",
    blockId: "B2",
    title: "Lesson 2.2: Structural Integrity",
    description: "Legacy code is noise. Mutate the file system architecture to align with modern standards. Follow the 'MIGRATION.md' spec to reorganize the nexus.",
    example: "mkdir -p core/models && mv legacy/user.py core/models/",
    tasks: [
      {
        id: "T1",
        instruction: "Reorganize the '/legacy' folder into a modern '/core' structure as defined in 'MIGRATION.md'.",
        validate: (vfs, history, currentPath) => {
          const hasUser = vfs['/core/models/user.py']?.type === 'file';
          const hasApi = vfs['/core/api/v1.py']?.type === 'file';
          const legacyEmpty = vfs['/legacy']?.type === 'dir' && (vfs['/legacy'] as DirNode).children.length === 0;
          return hasUser && hasApi && legacyEmpty;
        },
        hint: "Restructure the system using recursive creation and relocation. Example: 'mkdir -p project/src && mv old.js project/src/'"
      }
    ],
    feedback: {
      success: "✓ ARCHITECTURE_MUTATED. Structural integrity verified."
    }
  },
  {
    id: "L2-3-FILTER",
    blockId: "B2",
    title: "Lesson 2.3: Noise Reduction",
    description: "The system is flooded with noise. Distill the data stream to find critical errors. Use pipes, filters, and redirection to archive the signal.",
    example: "grep ERROR system.log | sort > errors.log",
    tasks: [
      {
        id: "T1",
        instruction: "Extract all lines containing 'ERROR_404' from 'system.log', sort them by timestamp, and save to 'distilled_errors.log'.",
        validate: (vfs, history, currentPath) => {
          const file = vfs['/distilled_errors.log'] as FileNode;
          if (!file) return false;
          const lines = file.content.split('\n').filter(Boolean);
          const hasErrors = lines.every(l => l.includes('ERROR_404'));
          const isSorted = lines.length === 3 && lines[0].includes('sector 7') && lines[2].includes('detected');
          return hasErrors && isSorted;
        },
        hint: "Filter, organize, and archive specific signal patterns. Example: 'cat app.log | grep WARN | sort > results.txt'"
      }
    ],
    feedback: {
      success: "✓ SIGNAL_DISTILLED. Decryption protocol initiated. YOU ARE NOW READY TO INTERACT WITH THE INTELLIGENCE SIGNAL."
    }
  },
  {
    id: "L2-4-INSENSITIVE",
    blockId: "B2",
    title: "Lesson 2.4: Pattern Recognition",
    description: "The system logs are inconsistent. Scan for critical signatures regardless of their casing. Mastery of the case-insensitive signal is paramount.",
    example: "grep -i 'pattern' file.log",
    tasks: [
      {
        id: "T1",
        instruction: "Search 'system.log' for all occurrences of 'error' (case-insensitive) and output them to the terminal.",
        validate: (vfs, history, currentPath) => {
          const lastInput = history.filter(h => h.type === 'input').pop();
          const lastOutput = history.filter(h => h.type === 'output').pop();
          const isGrepI = lastInput?.content.includes('grep -i') && lastInput?.content.includes('error');
          const hasResults = lastOutput?.content.toLowerCase().includes('error_404') && 
                            lastOutput?.content.split('\n').filter(Boolean).length >= 3;
          return !!(isGrepI && hasResults);
        },
        hint: "Ignore the variance in signal casing to capture all matches. Example: 'grep -i \"debug\" app.log'"
      }
    ],
    feedback: {
      success: "✓ PATTERN_RECOGNIZED. Inconsistencies accounted for."
    }
  },
  {
    id: "L2-5-RECURSIVE",
    blockId: "B2",
    title: "Lesson 2.5: Recursive Audit",
    description: "Deep intelligence requires deep scanning. Audit the entire source tree for specific protocol versions. Traverse the hierarchy recursively.",
    example: "grep -r 'signal' src/",
    tasks: [
      {
        id: "T1",
        instruction: "Perform a recursive search for the string 'API v1' within the entire '/src' directory.",
        validate: (vfs, history, currentPath) => {
          const lastInput = history.filter(h => h.type === 'input').pop();
          const lastOutput = history.filter(h => h.type === 'output').pop();
          const isRecursive = (lastInput?.content.includes('grep -r') || lastInput?.content.includes('grep -R')) && 
                             lastInput?.content.includes('API v1');
          const hasMatch = lastOutput?.content.includes('/src/app/routes/api.py');
          return !!(isRecursive && hasMatch);
        },
        hint: "Scan through all nested nodes in a directory branch. Example: 'grep -r \"FIXME\" project/'"
      }
    ],
    feedback: {
      success: "✓ AUDIT_COMPLETE. All nodes verified. Block 2 finalized."
    }
  },
  {
    id: "L3-1-REACT",
    blockId: "B3",
    title: "Lesson 3.1: The ReAct Loop",
    description: "Expectation is taking its toll, Architect. Before an agent can change the world, it must perceive it. You are now the 'Observations' for the AI's 'Actions'.",
    tasks: [
      {
        id: "T1",
        instruction: "Feed the agent the sensory input it needs. Complete the ReAct loop by providing observations.",
        validate: (vfs, history, currentPath) => {
          // This lesson is validated via the special logic in TerminalController/LogicFeed
          const state = useLessonStore.getState();
          return state.currentLogicStepIdx >= 2 && state.agentStatus === 'SUCCESS';
        },
        hint: "Follow the Agent Logic feed on the right. Provide the exact commands it expects."
      }
    ],
    logicChain: [
      {
        step: 1,
        ai_thought: "THOUGHT: I am initialized in a new nexus. I must map the infrastructure to understand the available state.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "ls",
        hint: "The agent is blind. Use 'ls' to provide sensory input of the root directory.",
        on_success: "OBSERVATION: Root directory mapped. I see main.py, STS.md, and logs/."
      },
      {
        step: 2,
        ai_thought: "THOUGHT: The directory structure is clear. Now I must verify the core logic. Show me the contents of the primary execution file.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "cat main.py",
        hint: "The agent needs to 'read' the code. Use 'cat' to stream the content of main.py.",
        on_success: "OBSERVATION: main.py content ingested. The signal is simple but stable."
      },
      {
        step: 3,
        ai_thought: "THOUGHT: I detect a potential constraint conflict. I need to audit the 'Brain File' to ensure my actions align with the Architect's rules.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "cat STS.md",
        hint: "The agent is questioning its boundaries. Feed it the STS.md file.",
        on_success: "OBSERVATION: Constraints identified. I am bound by the Senior Architect persona."
      }
    ],
    feedback: {
      success: "✓ SIGNAL_SYNCHRONIZED. The ReAct loop is closed. You have successfully fed the mind."
    }
  },
  {
    id: "L3-2-BRAIN",
    blockId: "B3",
    title: "Lesson 3.2: The State Architect",
    description: "An agent is only as good as its constraints. You must now define the persona and rules in the Brain File (STS.md).",
    tasks: [
      {
        id: "T1",
        instruction: "Update 'STS.md' to include a '# Constraints' section with the rule: 'Always use recursive logic for file scanning'.",
        validate: (vfs, history, currentPath) => {
          const file = vfs['/STS.md'] as FileNode;
          return file?.content.includes('# Constraints') && file?.content.includes('Always use recursive logic');
        },
        hint: "Use redirection to update the file. Example: 'echo \"# Constraints\\nAlways use...\" >> STS.md'"
      }
    ],
    feedback: {
      success: "✓ BRAIN_MODIFIED. Constraints are now part of the agent's core memory."
    }
  },
  {
    id: "L3-3-SATURATION",
    blockId: "B3",
    title: "Lesson 3.3: Signal Saturation",
    description: "The context window is a precious resource. Clean up the logs to prevent noise from drowning out the intelligence signal.",
    tasks: [
      {
        id: "T1",
        instruction: "Clear the 'logs/debug.log' file to reclaim context tokens.",
        validate: (vfs, history, currentPath) => {
          const file = vfs['/logs/debug.log'] as FileNode;
          return file?.content === '';
        },
        hint: "Empty the file contents. Example: 'echo \"\" > logs/debug.log'"
      }
    ],
    feedback: {
      success: "✓ CONTEXT_OPTIMIZED. Signal-to-noise ratio at maximum efficiency."
    }
  },
  {
    id: "L3-4-REFLECTION",
    blockId: "B3",
    title: "Lesson 3.4: The Reflection Protocol",
    description: "Deep intelligence requires self-correction. Teach the agent to review its state and fix logical flaws before they propagate.",
    tasks: [
      {
        id: "T1",
        instruction: "Force the agent to reflect. Execute the linter on 'main.py' and verify its integrity.",
        validate: (vfs, history, currentPath) => {
           const lastInput = history.filter(h => h.type === 'input').pop();
           return !!lastInput?.content.includes('grep') && !!lastInput?.content.includes('main.py');
        },
        hint: "Verify the core signal. Example: 'grep print main.py'"
      }
    ],
    feedback: {
      success: "✓ REFLECTION_ACTIVE. The agent is now self-aware of its output quality."
    }
  },
  {
    id: "L3-5-FEWSHOT",
    blockId: "B3",
    title: "Lesson 3.5: Few-Shot Architectures",
    description: "Lock in the pattern. Provide few-shot examples in the Brain File to ensure predictable infrastructure.",
    tasks: [
      {
        id: "T1",
        instruction: "Add a '# Patterns' section to 'STS.md' with a code example matching the 'Perfect API Endpoint' pattern.",
        validate: (vfs, history, currentPath) => {
          const file = vfs['/STS.md'] as FileNode;
          return file?.content.includes('# Patterns') && file?.content.includes('Perfect API Endpoint');
        },
        hint: "Document the pattern to enforce architectural stability. Example: 'echo \"# Patterns...\" >> STS.md'"
      }
    ],
    feedback: {
      success: "✓ PATTERN_LOCKED. Block 3 finalized. Agent discipline enforced."
    }
  },
  // BLOCK 4: THE MOMENT (The Gemini CLI Protocol)
  {
    id: "L4-1-SUMMONING",
    blockId: "B4",
    title: "4.1: The Summoning",
    description: "Learn the difference between interactive and non-interactive modes with 'gemini'.",
    tasks: [
      {
        id: "T1",
        instruction: "Pipe the README.md into Gemini for a quick summary: 'cat README.md | gemini -p \"summarize this\"'",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('SUMMARY') && history.some(h => h.content.includes('gemini -p'));
        },
        hint: "Automation starts with piping. Use 'cat README.md | gemini -p ...'"
      }
    ],
    feedback: {
      success: "✓ SIGNAL_INITIALIZED. Gemini CLI summarizes the nexus with 100% accuracy."
    }
  },
  {
    id: "L4-2-SENSORY",
    blockId: "B4",
    title: "4.2: Sensory Injection",
    description: "Inject high-density context using the '@' symbol.",
    tasks: [
      {
        id: "T1",
        instruction: "Explain the logic in the auth service: 'gemini \"Explain @src/auth.py\"'",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('AUTH_LOGIC') && history.some(h => h.content.includes('@src/auth.py'));
        },
        hint: "The '@' symbol is your sensory bridge to the VFS."
      }
    ],
    feedback: {
      success: "✓ CONTEXT_INJECTED. Gemini has digested the auth logic."
    }
  },
  {
    id: "L4-3-THINKING",
    blockId: "B4",
    title: "4.3: The Thinking Loop",
    description: "Discover available tools within the Gemini REPL.",
    tasks: [
      {
        id: "T1",
        instruction: "Enter the Gemini REPL and run '/tools' to see the agent's capabilities.",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('grep') && !!lastOutput?.includes('file_write');
        },
        hint: "Inside the REPL, '/tools' reveals the hidden hand of the architect."
      }
    ],
    feedback: {
      success: "✓ CAPABILITIES_DISCOVERED. You now know what the ghost can do."
    }
  },
  {
    id: "L4-4-GHOST",
    blockId: "B4",
    title: "4.4: The Ghost in the Shell",
    description: "Execute local shell commands without leaving the AI session.",
    tasks: [
      {
        id: "T1",
        instruction: "Inside the Gemini REPL, run '! ls' to see the project state.",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('VFS_SNAPSHOT') && history.some(h => h.content.includes('! ls'));
        },
        hint: "The '!' prefix bridges the AI session back to the machine."
      }
    ],
    feedback: {
      success: "✓ BRIDGE_ESTABLISHED. You can now command the machine from within the mind."
    }
  },
  {
    id: "L4-5-PERSISTENCE",
    blockId: "B4",
    title: "4.5: Persistence of Mind",
    description: "Manage session states using chat save and resume.",
    tasks: [
      {
        id: "T1",
        instruction: "Save your current session: '/chat save debug_v1', then resume it: '/chat resume debug_v1'.",
        validate: (vfs, history, currentPath) => {
          const hasSave = history.some(h => h.content.includes('/chat save debug_v1'));
          const hasResume = history.some(h => h.content.includes('/chat resume debug_v1'));
          return hasSave && hasResume;
        },
        hint: "Memory is volatile unless tagged. Use '/chat save' and '/chat resume'."
      }
    ],
    feedback: {
      success: "✓ STATE_PERSISTED. The session is locked in time."
    }
  },
  {
    id: "L4-6-ARCHITECT",
    blockId: "B4",
    title: "4.6: The Architect's Will",
    description: "Ground the model using a GEMINI.md configuration file.",
    tasks: [
      {
        id: "T1",
        instruction: "Create a 'GEMINI.md' file with the rule: 'Always use Tailwind CSS.'",
        validate: (vfs, history, currentPath) => {
          const file = vfs['/GEMINI.md'] as FileNode;
          return !!file?.content.includes('Tailwind CSS');
        },
        hint: "GEMINI.md is the law of the directory."
      }
    ],
    feedback: {
      success: "✓ GROUNDING_ESTABLISHED. The agent now follows your architectural intent."
    }
  },
  {
    id: "L4-7-GROUNDED",
    blockId: "B4",
    title: "4.7: Grounded Reality",
    description: "Bridge the knowledge gap with real-time web search.",
    tasks: [
      {
        id: "T1",
        instruction: "Ask Gemini about the latest 2026 changes: 'gemini \"What are the latest changes in Gemini 2.5?\"'",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('SEARCH_RESULTS') && !!lastOutput?.includes('Gemini 2.5');
        },
        hint: "When internal data fails, the web search tool provides the signal."
      }
    ],
    feedback: {
      success: "✓ REALITY_SYNCED. The agent is now aware of the present moment."
    }
  },
  {
    id: "L4-8-PROTOCOL",
    blockId: "B4",
    title: "4.8: The Protocol Layer",
    description: "Manage external integrations via MCP.",
    tasks: [
      {
        id: "T1",
        instruction: "List the connected MCP servers: '/mcp list'.",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('Postgres MCP') && !!lastOutput?.includes('Slack MCP');
        },
        hint: "MCP is the nervous system of the agentic web."
      }
    ],
    feedback: {
      success: "✓ PROTOCOL_MAPPED. External services are now within reach."
    }
  },
  {
    id: "L4-9-YOLO",
    blockId: "B4",
    title: "4.9: The Yolo Threshold",
    description: "Master autonomous execution modes.",
    tasks: [
      {
        id: "T1",
        instruction: "Run a refactor in YOLO mode: 'gemini --yolo \"Refactor src/auth.py\"'.",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('AUTONOMOUS_EXECUTION') && history.some(h => h.content.includes('--yolo'));
        },
        hint: "YOLO mode removes the human-in-the-loop. Use with caution."
      }
    ],
    feedback: {
      success: "✓ YOLO_MODE_ACTIVE. The agent is now operating with full autonomy."
    }
  },
  {
    id: "L4-10-SYNTHESIS",
    blockId: "B4",
    title: "4.10: The Synthesis",
    description: "The Final Synthesis. Full project automation.",
    tasks: [
      {
        id: "T1",
        instruction: "Execute a complex mission: Read @README.md, check ! git status, and refactor in --yolo mode.",
        validate: (vfs, history, currentPath) => {
          const h = history.map(x => x.content).join(' ');
          return h.includes('@README.md') && h.includes('! git status') && h.includes('--yolo');
        },
        hint: "Combine all lessons into one final signal."
      }
    ],
    feedback: {
      success: "✓ ARCHITECT_CONFIRMED. You have mastered the Gemini CLI Protocol. The Nexus is yours."
    }
  }
];

interface LessonStore {
  currentLessonIdx: number;
  maxLessonIdx: number;
  completedLessonIds: string[];
  currentTaskIdx: number;
  isSuccess: boolean;
  isDecrypting: boolean;
  view: 'dashboard' | 'lesson';
  currentBlockId: string;
  agentStatus: AgentStatus;
  currentLogicStepIdx: number;
  apiKey: string | null;
  authMode: boolean;
  setCurrentLessonIdx: (idx: number) => void;
  setCurrentTaskIdx: (idx: number) => void;
  setIsSuccess: (success: boolean) => void;
  setIsDecrypting: (isDecrypting: boolean) => void;
  setView: (view: 'dashboard' | 'lesson') => void;
  setCurrentBlockId: (id: string) => void;
  setAgentStatus: (status: AgentStatus) => void;
  setCurrentLogicStepIdx: (idx: number) => void;
  setApiKey: (key: string | null) => void;
  setAuthMode: (authMode: boolean) => void;
  nextLesson: () => void;
  jumpToLesson: (idx: number) => void;
  validateCurrentTask: (vfs: VFSState, history: VFSStore['history'], currentPath: string) => boolean;
}

export const useLessonStore = create<LessonStore>()(
  persist(
    (set, get) => ({
      currentLessonIdx: 0,
      maxLessonIdx: 0,
      completedLessonIds: [],
      currentTaskIdx: 0,
      isSuccess: false,
      isDecrypting: false,
      view: 'dashboard',
      currentBlockId: 'B1',
      agentStatus: 'THINKING',
      currentLogicStepIdx: 0,
      apiKey: null,
      authMode: false,
      setCurrentLessonIdx: (idx) => {
        const state = get();
        // Only allow selecting lessons that have been reached
        if (idx >= 0 && idx <= state.maxLessonIdx && idx < LESSONS.length) {
          const lesson = LESSONS[idx];
          // Sync VFS if block changed
          const vfsStore = (useVFSStore as any).getState();
          if (vfsStore.currentBlockId !== lesson.blockId) {
            vfsStore.initializeForBlock(lesson.blockId);
          }

          set({
            currentLessonIdx: idx,
            currentBlockId: lesson.blockId,
            currentTaskIdx: 0,
            isSuccess: false,
            view: 'lesson',
            isDecrypting: false,
            agentStatus: 'THINKING',
            currentLogicStepIdx: 0
          });
        }
      },
      setCurrentTaskIdx: (idx) => set({ currentTaskIdx: idx }),
      setIsSuccess: (success) => {
        const state = get();
        let newCompleted = state.completedLessonIds;
        if (success) {
          const lessonId = LESSONS[state.currentLessonIdx].id;
          if (!newCompleted.includes(lessonId)) {
            newCompleted = [...newCompleted, lessonId];
          }
        }
        set({ isSuccess: success, completedLessonIds: newCompleted });
      },
      setIsDecrypting: (isDecrypting) => set({ isDecrypting }),
      setView: (view) => set({ view }),
      setCurrentBlockId: (id) => set({ currentBlockId: id }),
      setAgentStatus: (status) => set({ agentStatus: status }),
      setCurrentLogicStepIdx: (idx) => set({ currentLogicStepIdx: idx }),
      setApiKey: (apiKey) => set({ apiKey }),
      setAuthMode: (authMode) => set({ authMode }),
      nextLesson: () => {
        const state = get();
        if (state.currentLessonIdx < LESSONS.length - 1) {
          const nextIdx = state.currentLessonIdx + 1;
          const currentId = LESSONS[state.currentLessonIdx].id;
          const newCompleted = state.completedLessonIds.includes(currentId)
            ? state.completedLessonIds
            : [...state.completedLessonIds, currentId];

          const nextLesson = LESSONS[nextIdx];
          // Sync VFS if block changed
          const vfsStore = (useVFSStore as any).getState();
          if (vfsStore.currentBlockId !== nextLesson.blockId) {
            vfsStore.initializeForBlock(nextLesson.blockId);
          }

          set({
            currentLessonIdx: nextIdx,
            currentBlockId: nextLesson.blockId,
            currentTaskIdx: 0,
            isSuccess: false,
            maxLessonIdx: Math.max(state.maxLessonIdx, nextIdx),
            completedLessonIds: newCompleted,
            isDecrypting: false,
          });
        }
      },
      jumpToLesson: (idx) => {
        const state = get();
        // Only allow jumping back to completed lessons or the current furthest reached lesson
        if (idx >= 0 && idx <= state.maxLessonIdx && idx < LESSONS.length) {
          const lesson = LESSONS[idx];
          // Sync VFS if block changed
          const vfsStore = (useVFSStore as any).getState();
          if (vfsStore.currentBlockId !== lesson.blockId) {
            vfsStore.initializeForBlock(lesson.blockId);
          }

          set({
            currentLessonIdx: idx,
            currentBlockId: lesson.blockId,
            currentTaskIdx: 0,
            isSuccess: false,
            isDecrypting: false,
            view: 'lesson'
          });
        }
      },
      validateCurrentTask: (vfs, history, currentPath) => {
        const state = get();
        const currentLesson = LESSONS[state.currentLessonIdx];
        if (!currentLesson) return false;

        const currentTask = currentLesson.tasks[state.currentTaskIdx];
        if (!currentTask) return false;

        if (currentTask.validate(vfs, history, currentPath)) {
          // Task completed!
          if (state.currentTaskIdx < currentLesson.tasks.length - 1) {
            set({ currentTaskIdx: state.currentTaskIdx + 1 });
            return false; // Not lesson complete, just task complete
          } else {
            // Lesson complete!
            if (!state.isSuccess) {
              const lessonId = currentLesson.id;
              const newCompleted = state.completedLessonIds.includes(lessonId)
                ? state.completedLessonIds
                : [...state.completedLessonIds, lessonId];

              set({
                isSuccess: true,
                isDecrypting: true,
                completedLessonIds: newCompleted,
                maxLessonIdx: Math.max(state.maxLessonIdx, state.currentLessonIdx + 1)
              });
              return true;
            }
          }
        }
        return false;
      }
    }),
    {
      name: 'signal-shell-lesson',
      partialize: (state) => ({
        currentLessonIdx: state.currentLessonIdx,
        maxLessonIdx: state.maxLessonIdx,
        completedLessonIds: state.completedLessonIds,
        currentTaskIdx: state.currentTaskIdx,
        view: state.view,
        currentBlockId: state.currentBlockId
      }),
    }
  )
);
