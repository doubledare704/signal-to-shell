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
  },
  {
    id: "B6",
    title: "Block 6: The Less I Know The Better",
    subtitle: "The Vector State (Deep Memory)",
    description: "\u201cSomeone said, it\u2019s not now or never / Wait 10 years, we\u2019ll be together.\u201d Move from terminal to the Vector Vault."
  },
  {
    id: "B7",
    title: "Block 7: Apocalypse Dreams",
    subtitle: "The Headless Production (Cloud)",
    description: "“Everything is changing... I can't stop it now.” Move the Signal into FastAPI, containers, Cloud Run, and open-web pressure."
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
  },
  // BLOCK 5: TOMORROW'S DUST (Agentic Orchestration)
  {
    id: "L5-1-MCP-DISCOVERY",
    blockId: "B5",
    title: "5.1: The Discovery Layer",
    description: "The Nexus is stable, but it is blind to the outside world. To orchestrate true state, the Intelligence must bridge the gap. We will use the Model Context Protocol to attach a database to the Signal.",
    tasks: [
      {
        id: "T1",
        instruction: "Connect the Gemini CLI to the local SQLite database. Use 'gemini mcp add sqlite' then query it.",
        validate: (vfs, history, currentPath) => {
          const state = useLessonStore.getState();
          return state.currentLogicStepIdx >= 2 && state.agentStatus === 'SUCCESS';
        },
        hint: "Follow the ReAct loop. First list the MCP servers, then add the sqlite server, then query it."
      }
    ],
    logicChain: [
      {
        step: 1,
        ai_thought: "THOUGHT: I am isolated. I detect a 'database.sqlite' file, but I lack the native tools to query it. Architect, what external connections are currently configured in my registry?",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "gemini mcp list",
        hint: "The agent needs an inventory of its MCP servers. Use 'gemini mcp list'.",
        on_success: "OBSERVATION: Registry scanned. [0] MCP Servers found. I am confined to the file system."
      },
      {
        step: 2,
        ai_thought: "THOUGHT: To manipulate the data state, I need a bridge. Attach the official SQLite MCP server to my sensory array.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "gemini mcp add sqlite",
        hint: "Command the CLI to install the SQLite bridge. Run 'gemini mcp add sqlite'.",
        on_success: "OBSERVATION: MCP Server 'sqlite' synchronized. New tools unlocked: [read_query, list_tables]."
      },
      {
        step: 3,
        ai_thought: "THOUGHT: The bridge is established. My sensory array has expanded. Command me to utilize this new tool to map the internal state of the database.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "gemini \"List the tables in database.sqlite\"",
        hint: "Now that Gemini has the tool, ask it a natural language question about the database.",
        on_success: "OBSERVATION: |⌐■_■| Tool [list_tables] executed. Discovered tables: 'users', 'telemetry', 'system_logs'."
      }
    ],
    feedback: {
      success: "✓ SENSORY_EXPANSION_COMPLETE. The Database is now part of the Intelligence Signal."
    }
  },
  {
    id: "L5-2-ARCHITECT-HAND",
    blockId: "B5",
    title: "5.2: The Architect's Hand",
    description: "Extend the machine. Understand the anatomy of an MCP server by configuring its settings.",
    tasks: [
      {
        id: "T1",
        instruction: "Register a custom 'system-monitor' tool in '.gemini/settings.json' and ask Gemini to audit the system load.",
        validate: (vfs, history, currentPath) => {
          const file = vfs['/.gemini/settings.json'] as FileNode;
          return !!file?.content.includes('system-monitor') && history.some(h => h.content.includes('system load'));
        },
        hint: "Create the config directory and file, then use 'gemini' to query the new tool."
      }
    ],
    feedback: {
      success: "✓ CUSTOM_EXTENSIONS_LOCKED. The machine now observes its own physical existence."
    }
  },
  {
    id: "L5-3-PLANNING",
    blockId: "B5",
    title: "5.3: The Planning Pattern",
    description: "Move from guessing to planning. Task Gemini with a complex refactor that requires a roadmap before execution.",
    tasks: [
      {
        id: "T1",
        instruction: "Task Gemini with a complex mission. It must output a 'PLAN.md' first, wait for your approval, and then execute.",
        validate: (vfs, history, currentPath) => {
          return !!vfs['/PLAN.md'] || history.some(h => h.content.includes('PLAN.md'));
        },
        hint: "Instruct Gemini: 'Create a PLAN.md for refactoring app.py then wait for my signal.'"
      }
    ],
    feedback: {
      success: "✓ PLANNING_PROTOCOL_ENFORCED. Guesswork has been purged from the nexus."
    }
  },  {
    id: "L5-4-HIVEMIND",
    blockId: "B5",
    title: "5.4: The Hive Mind",
    description: "Acting as the Orchestrator, splitting the intelligence into two distinct sub-agents: the Scout and the Fixer.",
    tasks: [
      {
        id: "T1",
        instruction: "Delegate the state recovery. Spawn a Scout to audit the logs, then a Fixer to apply the correction in --yolo mode.",
        validate: (vfs, history, currentPath) => {
          const state = useLessonStore.getState();
          return state.currentLogicStepIdx >= 1 && state.agentStatus === 'SUCCESS';
        },
        hint: "Follow the logic chain. First spawn the scout, then engage the fixer."
      }
    ],
    logicChain: [
      {
        step: 1,
        ai_thought: "THOUGHT: I detect a crash in the app.py execution state. I need a Scout sub-agent to retrieve the stack trace from /logs/crash.log.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "gemini \"Spawn a sub-agent to audit /logs/crash.log and report the error\"",
        hint: "Use the sub-agent syntax to delegate the research task.",
        on_success: "OBSERVATION: |⌐■_■| [Sub-Agent: Scout] Audit complete. ZeroDivisionError detected at app.py:2. Signal relayed to Orchestrator."
      },
      {
        step: 2,
        ai_thought: "THOUGHT: The Scout has provided the data. Now, I need a Fixer sub-agent to apply the correction in --yolo mode to restore the state.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "gemini --yolo \"Sub-agent Fixer: Use the Scout's report to fix app.py\"",
        hint: "Delegate the repair to a second sub-agent using the --yolo flag.",
        on_success: "OBSERVATION: |⌐■_■| [Sub-Agent: Fixer] Code injection successful. app.py line 2 wrapped in try/except block. State: STABLE."
      }
    ],
    feedback: {
      success: "✓ HIVE_MIND_SYNCHRONIZED. Delegation is the ultimate form of state control."
    }
  },
  {
    id: "L5-5-COMPRESS",
    blockId: "B5",
    title: "5.5: Sensory Overload",
    description: "Manage 'Context Rot'. Learn to use /compress to distill the state without losing the core signal.",
    tasks: [
      {
        id: "T1",
        instruction: "The history is overwhelming. Run '/compress' to reduce the token history into a 'Memory Summary'.",
        validate: (vfs, history, currentPath) => {
          return history.some(h => h.content.includes('/compress')) && history.some(h => h.content.includes('MEMORY_SUMMARY'));
        },
        hint: "When signals collide, compression is the only path. Run '/compress'."
      }
    ],
    feedback: {
      success: "✓ CONTEXT_DISTILLED. Memory density optimized for long-term orchestration."
    }
  },
  {
    id: "L5-6-SAFETY",
    blockId: "B5",
    title: "5.6: The Safety Brake",
    description: "Constrain the mischief. Use guardrails to prevent dangerous actions during autonomous runs.",
    tasks: [
      {
        id: "T1",
        instruction: "Configure a 'Sandbox Mode' in GEMINI.md that forbids the 'terminal' tool but allows 'file_write'.",
        validate: (vfs, history, currentPath) => {
          const file = vfs['/GEMINI.md'] as FileNode;
          return !!file?.content.includes('excludeTools') && !!file?.content.includes('terminal');
        },
        hint: "Update GEMINI.md with an 'excludeTools: [\"terminal\"]' rule."
      }
    ],
    feedback: {
      success: "✓ GUARDRAILS_ACTIVE. The agent is now safe for autonomous operation."
    }
  },
  {
    id: "L5-7-OBSERVABILITY",
    blockId: "B5",
    title: "5.7: Observability",
    description: "Audit the intelligence. Use /stats to analyze token consumption and thought efficiency.",
    tasks: [
      {
        id: "T1",
        instruction: "Analyze the current signal metrics. Run '/stats' to see the token bloat and tool-call latency.",
        validate: (vfs, history, currentPath) => {
          return history.some(h => h.content.includes('/stats')) && history.some(h => h.content.includes('TOKEN_BLOAT'));
        },
        hint: "Observability is the architect's second sight. Run '/stats'."
      }
    ],
    feedback: {
      success: "✓ METRICS_CAPUTRED. Efficiency drift identified and neutralized."
    }
  },
  {
    id: "L5-8-SELFHEALING",
    blockId: "B5",
    title: "5.8: The Self-Healing State",
    description: "Construct a pipeline that listens to the dust and heals the nexus automatically.",
    tasks: [
      {
        id: "T1",
        instruction: "Construct the self-healing loop. Pipe the crash logs into 'gemini --yolo' and verify the fix with 'python server.py'.",
        validate: (vfs, history, currentPath) => {
          const state = useLessonStore.getState();
          return state.currentLogicStepIdx >= 2 && state.agentStatus === 'SUCCESS';
        },
        hint: "Expose the error with tail, pipe it to gemini --yolo, then run the server."
      }
    ],
    logicChain: [
      {
        step: 1,
        ai_thought: "THOUGHT: The server state has panicked. I need the Architect to pipe the log stream into my logic core to verify the anomaly.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "tail -n 2 logs/system.log",
        hint: "Use 'tail -n 2 logs/system.log' to expose the error.",
        on_success: "OBSERVATION: Error confirmed. The dust shows a memory leak."
      },
      {
        step: 2,
        ai_thought: "THOUGHT: I understand the error. Pipe the tail output into my executable with the YOLO flag so I can patch server.py autonomously.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "tail -n 2 logs/system.log | gemini --yolo \"Fix the error in server.py based on this log\"",
        hint: "Pipe the log into 'gemini --yolo' and instruct it to fix the server.",
        on_success: "OBSERVATION: |⌐■_■| [YOLO MODE ACTIVE] Log ingested. Applying patch to server.py. State healed."
      },
      {
        step: 3,
        ai_thought: "THOUGHT: The patch has been applied. Run the server to verify the new stable state.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "python server.py",
        hint: "Verify the fix. Execute 'python server.py'.",
        on_success: "OBSERVATION: Server running... [STABLE]. The architecture is self-sustaining."
      }
    ],
    feedback: {
      success: "✓ AUTONOMOUS_LOOP_CLOSED. The State is now self-sustaining."
    }
  },
  {
    id: "L5-9-FLEET",
    blockId: "B5",
    title: "5.9: Fleet Management",
    description: "Manage global vs local state using multiple GEMINI.md files at different directory depths.",
    tasks: [
      {
        id: "T1",
        instruction: "Establish local rules. Create 'src/frontend/GEMINI.md' with React rules and 'src/backend/GEMINI.md' with Python rules.",
        validate: (vfs, history, currentPath) => {
          const f = vfs['/src/frontend/GEMINI.md'] as FileNode;
          const b = vfs['/src/backend/GEMINI.md'] as FileNode;
          return !!f?.content.includes('React') && !!b?.content.includes('Python');
        },
        hint: "Create the nested directories then touch the individual GEMINI.md files."
      }
    ],
    feedback: {
      success: "✓ FLEET_MANAGED. Personas now shift automatically based on directory depth."
    }
  },
  {
    id: "L5-10-LEGACY",
    blockId: "B5",
    title: "5.10: The Architect's Legacy",
    description: "The Final Capstone. Full Autonomous Lifecycle orchestration.",
    tasks: [
      {
        id: "T1",
        instruction: "Execute the final mission: Plan the SaaS, add the cloud-run MCP, and deploy in --yolo mode.",
        validate: (vfs, history, currentPath) => {
          const state = useLessonStore.getState();
          return state.currentLogicStepIdx >= 2 && state.agentStatus === 'SUCCESS';
        },
        hint: "Follow the architect's ritual: Plan, Add Tool, Execute YOLO."
      }
    ],
    logicChain: [
      {
        step: 1,
        ai_thought: "THOUGHT: I am ready. Architect, verify the GEMINI.md directive and initialize the planning phase.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "gemini \"Plan the SaaS architecture using @GEMINI.md\"",
        hint: "Start by having Gemini create the architectural blueprint using '@GEMINI.md'.",
        on_success: "OBSERVATION: |⌐■_■| [PLANNING_ACTIVE] 1. Expand api.py. 2. Attach Database MCP. 3. Execute infra/deploy.sh."
      },
      {
        step: 2,
        ai_thought: "THOUGHT: The plan is locked. Connect to the external Cloud-Run MCP to prepare the deployment target.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "gemini mcp add cloud-run",
        hint: "Expand your sensory array. Add the 'cloud-run' MCP server.",
        on_success: "OBSERVATION: [MCP: cloud-run] Registered. Destination: nexus-production-v1. Status: READY."
      },
      {
        step: 3,
        ai_thought: "THOUGHT: I have the plan and the tools. I will now perform the final autonomous execution. Architect, release the safety.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "gemini --yolo \"Execute the build and deploy to @infra/deploy.sh via cloud-run MCP\"",
        hint: "The autonomous deployment. Use '--yolo' to authorize the full sequence.",
        on_success: "OBSERVATION: |⌐■_■| [YOLO_MODE] Patching api.py... Success. Running deploy.sh... Success. Verifying health-check... [STABLE]. MISSION COMPLETE."
      }
    ],
    feedback: {
      success: "✓ LEGACY_ESTABLISHED. THE NEXUS IS ALIVE. YOU ARE THE SIGNAL."
    }
  },

  // BLOCK 6: THE LESS I KNOW THE BETTER (The Vector State)
  {
    id: "L6-1-EMBED",
    blockId: "B6",
    title: "6.1: Semantic Math (The Embedding Signal)",
    description: "State can be represented as a vector in multi-dimensional space. 'Cat' and 'Kitten' are mathematically close. 'Cat' and 'Car' are not. Generate your first embedding using the Gemini model.",
    example: "gemini embed \"def finalize_order():\"",
    tasks: [
      {
        id: "T1",
        instruction: "Generate an embedding: 'gemini embed \"def finalize_order():\"]'",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('VECTOR') && !!lastOutput?.includes('768-dim') && history.some(h => h.content.includes('gemini embed'));
        },
        hint: "Use 'gemini embed' to transform text into a 768-dimension floating-point vector."
      }
    ],
    feedback: {
      success: "\u2713 EMBEDDING_GENERATED. The text has been quantized into 768-dimensional semantic space."
    }
  },
  {
    id: "L6-2-PGVECTOR",
    blockId: "B6",
    title: "6.2: The Vector Vault (pgvector Setup)",
    description: "Configure the long-term memory store. SQL stores rows. Vector stores store meaning. Enable the pgvector extension in Supabase to unlock semantic retrieval.",
    tasks: [
      {
        id: "T1",
        instruction: "Enable pgvector via MCP: 'gemini mcp call supabase \"CREATE EXTENSION vector;\"'",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('EXTENSION_ENABLED') && history.some(h => h.content.includes('CREATE EXTENSION vector'));
        },
        hint: "Use the Supabase MCP to run the migration that enables the pgvector extension."
      }
    ],
    feedback: {
      success: "\u2713 VECTOR_VAULT_OPEN. pgvector extension enabled. The semantic index is ready for writes."
    }
  },
  {
    id: "L6-3-CHUNK",
    blockId: "B6",
    title: "6.3: Fragmenting the State (Chunking)",
    description: "Large files destroy retrieval accuracy. Fragment the signal into 500-token chunks with 10% overlap for surgical precision.",
    tasks: [
      {
        id: "T1",
        instruction: "Write the Python chunker: 'echo \"chunk_size=500\\nchunk_overlap=50\" > chunker.py'",
        validate: (vfs, history, currentPath) => {
          const file = vfs['/chunker.py'] as import('./vfsStore').FileNode;
          return !!file?.content.includes('chunk_size') && !!file?.content.includes('chunk_overlap');
        },
        hint: "Create 'chunker.py' with 'chunk_size' and 'chunk_overlap' variables using echo redirect."
      },
      {
        id: "T2",
        instruction: "Run the chunker to populate '/chunks': 'python chunker.py'",
        validate: (vfs, history, currentPath) => {
          return vfs['/chunks']?.type === 'dir' && history.some(h => h.content.includes('python chunker.py'));
        },
        hint: "Execute 'python chunker.py' to fragment docs.txt into the /chunks directory."
      }
    ],
    feedback: {
      success: "\u2713 STATE_FRAGMENTED. /chunks directory populated. Retrieval accuracy maximized."
    }
  },
  {
    id: "L6-4-COSINE",
    blockId: "B6",
    title: "6.4: The Retrieval Protocol (Cosine Similarity)",
    description: "Find the needle in the haystack. Cosine similarity measures the angle between two vectors. 1.0 = identical meaning. 0.0 = orthogonal noise.",
    tasks: [
      {
        id: "T1",
        instruction: "Query the vault: 'gemini mcp call supabase \"SELECT chunk_id FROM vectors ORDER BY embedding <=> embed('refunds') LIMIT 1;\"'",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('MATCH_FOUND') && history.some(h => h.content.includes('refund'));
        },
        hint: "Use the cosine distance operator '<=>'. Query for 'How do I handle refunds?' against the vector store."
      }
    ],
    feedback: {
      success: "\u2713 NEEDLE_EXTRACTED. Cosine similarity search returned the exact signal from the haystack."
    }
  },
  {
    id: "L6-5-SESSION",
    blockId: "B6",
    title: "6.5: Long-Term Memory (Session Persistence)",
    description: "Short-term memory vanishes on reboot. Store thoughts in the Vector Vault so the agent remembers across sessions.",
    tasks: [
      {
        id: "T1",
        instruction: "Save the session: 'gemini --session-id \"user_oleksii\" \"Save this session to the vault\"'",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('SESSION_SAVED') && history.some(h => h.content.includes('--session-id'));
        },
        hint: "Use '--session-id' to anchor this context to a persistent identity in the Vector Vault."
      },
      {
        id: "T2",
        instruction: "Retrieve across reboot: 'gemini --session-id \"user_oleksii\" \"What did we talk about yesterday?\"'",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('SESSION_RETRIEVED') && history.filter(h => h.content.includes('--session-id')).length >= 2;
        },
        hint: "Re-use the same '--session-id' to retrieve the persisted context vector."
      }
    ],
    feedback: {
      success: "\u2713 MEMORY_PERSISTENT. The agent now remembers across reboots. The Signal endures."
    }
  },
  {
    id: "L6-6-ROUTING",
    blockId: "B6",
    title: "6.6: The Hybrid Decision (RAG vs. Window)",
    description: "Architectural mastery: knowing when to Retrieve and when to Inject. The Cost-Latency-Accuracy triangle.",
    tasks: [
      {
        id: "T1",
        instruction: "Create 'routing_policy.json' with vault_threshold and prompt_threshold fields.",
        validate: (vfs, history, currentPath) => {
          const file = vfs['/routing_policy.json'] as import('./vfsStore').FileNode;
          return !!file?.content.includes('vault_threshold') && !!file?.content.includes('prompt_threshold');
        },
        hint: "Create routing_policy.json with 'vault_threshold' and 'prompt_threshold' fields using echo."
      }
    ],
    feedback: {
      success: "\u2713 ROUTING_OPTIMIZED. Token efficiency maximized. Cost-Latency-Accuracy triangle balanced."
    }
  },
  {
    id: "L6-7-WATCHER",
    blockId: "B6",
    title: "6.7: The Automated Watcher (Auto-Indexing)",
    description: "Zero-maintenance memory. Every time app.py is modified, the Vector Vault must be automatically updated.",
    tasks: [
      {
        id: "T1",
        instruction: "Establish the autonomous watcher loop. Modify the source file and trigger the re-indexing signal.",
        validate: (vfs, history, currentPath) => {
          const state = useLessonStore.getState();
          return state.currentLogicStepIdx >= 1 && state.agentStatus === 'SUCCESS';
        },
        hint: "Follow the Logic Feed. First modify app.py, then confirm the re-indexing query."
      }
    ],
    logicChain: [
      {
        step: 1,
        ai_thought: "THOUGHT: The Signal is dynamic. I need a watcher to detect modifications in the source logic and bridge them to the Vector Vault. Architect, modify src/app.py to trigger the sensor.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "echo \"# vector-indexed\" >> src/app.py",
        hint: "Append the trigger comment to src/app.py using echo.",
        on_success: "OBSERVATION: [SYSTEM]: FILE_CHANGE_DETECTED. The watcher has identified a mutation in src/app.py."
      },
      {
        step: 2,
        ai_thought: "THOUGHT: The mutation is captured. Now I must synchronize the Vault by executing the re-embedding protocol via the Supabase bridge.",
        expected_action_type: "COMMAND_EXECUTION",
        required_command: "gemini mcp call supabase \"UPDATE vectors SET embedding = re_embed(app_py) WHERE source = 'src/app.py';\"",
        hint: "Run the re-indexing query using the Supabase MCP.",
        on_success: "OBSERVATION: [SYSTEM]: RE-INDEXING_VECTOR_VAULT... [OK]. The semantic state is now current."
      }
    ],
    feedback: {
      success: "\u2713 WATCHER_ACTIVE. THE MEMORY IS SELF-HEALING."
    }
  },
  {
    id: "L6-8-PRUNE",
    blockId: "B6",
    title: "6.8: The Semantic Prune (Memory Hygiene)",
    description: "The vault accumulates conflict. Outdated embeddings poison retrieval. Prune the noise. Keep only the Signal.",
    tasks: [
      {
        id: "T1",
        instruction: "Scan for conflicts: 'gemini mcp call supabase \"SELECT chunk_id, version FROM vectors WHERE source = 'api_docs' ORDER BY version;\"'",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('CONFLICT_DETECTED') && history.some(h => h.content.includes('api_docs'));
        },
        hint: "Query the vault for api_docs entries to expose outdated version conflicts."
      },
      {
        id: "T2",
        instruction: "Prune outdated signals: 'gemini mcp call supabase \"DELETE FROM vectors WHERE source = 'api_docs' AND version < 3;\"'",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('PRUNED') && history.some(h => h.content.includes('DELETE FROM vectors'));
        },
        hint: "Delete old vector records (version < 3) to keep only the latest API documentation."
      },
      {
        id: "T3",
        instruction: "Verify clean vault: 'gemini mcp call supabase \"SELECT COUNT(*) FROM vectors WHERE source = 'api_docs';\"'",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('CLEAN') && history.some(h => h.content.includes('SELECT COUNT'));
        },
        hint: "Run a count query to confirm only the latest version remains in the vault."
      }
    ],
    feedback: {
      success: "\u2713 VAULT_CLEAN. Signal-to-noise ratio at maximum. The memory is pure."
    }
  },

  // BLOCK 7: APOCALYPSE DREAMS (The Headless Production)
  {
    id: "L7-1-API",
    blockId: "B7",
    title: "7.1: The API Gateway (FastAPI Wrapper)",
    description: "The simulation exits the local shell. Wrap Gemini CLI headless mode in FastAPI: a POST /signal payload becomes a subprocess call to `gemini -p`.",
    example: "curl -X POST /signal -d '{\"query\":\"audit logs\"}'",
    tasks: [
      {
        id: "T1",
        instruction: "Trigger the `/signal` gateway with a POST request that invokes `gemini -p`.",
        validate: (vfs, history) => {
          return history.some(h => h.content.includes('POST /signal')) &&
            history.some(h => h.content.includes('gemini -p "audit logs"'));
        },
        hint: "Use curl against /signal with a JSON query. The virtual server will show the subprocess bridge."
      }
    ],
    feedback: {
      success: "\u2713 API_GATEWAY_ONLINE. Terminal signal converted into a headless HTTP service."
    }
  },
  {
    id: "L7-2-STREAM",
    blockId: "B7",
    title: "7.2: Streamed Consciousness (SSE)",
    description: "Users will not wait in silence while an agent thinks. Stream Gemini CLI output line-by-line with Server-Sent Events so the browser sees the thoughts as they happen.",
    example: "curl -N /signal/stream",
    tasks: [
      {
        id: "T1",
        instruction: "Open the streaming endpoint and receive live SSE data frames.",
        validate: (vfs, history) => {
          const lastOutput = history.findLast(h => h.type === 'output')?.content;
          return !!lastOutput?.includes('event: thought') && !!lastOutput?.includes('data: SERVICE_READY');
        },
        hint: "Use `curl -N /signal/stream` to keep the response open for server-sent events."
      }
    ],
    feedback: {
      success: "\u2713 STREAM_OPEN. The web client now hears the agent thinking in real time."
    }
  },
  {
    id: "L7-3-STRICT",
    blockId: "B7",
    title: "7.3: Strict State (Pydantic Validation)",
    description: "Production agents must return contracts, not vibes. Use Gemini CLI structured output with `--output-format json`, then validate the response with a Pydantic model requiring `action` and `reason`.",
    example: "curl -X POST /signal/strict -d '{\"mode\":\"malformed\"}'",
    tasks: [
      {
        id: "T1",
        instruction: "Create a Pydantic model that requires `action` and `reason` fields.",
        validate: (vfs) => {
          const file = vfs['/app/schemas.py'] as import('./vfsStore').FileNode;
          return !!file?.content.includes('BaseModel') &&
            !!file.content.includes('action') &&
            !!file.content.includes('reason');
        },
        hint: "Write a schemas.py file with a BaseModel class and the two required fields."
      },
      {
        id: "T2",
        instruction: "Send a malformed strict request and confirm it returns `422 Unprocessable Entity`.",
        validate: (vfs, history) => {
          return history.some(h => h.content.includes('gemini -p') && h.content.includes('--output-format json')) &&
            history.some(h => h.content.includes('422 Unprocessable Entity'));
        },
        hint: "Use the strict endpoint with a malformed mode so the virtual validator rejects the response."
      }
    ],
    feedback: {
      success: "\u2713 STRICT_STATE_ENFORCED. Hallucinated JSON keys are rejected at the perimeter."
    }
  },
  {
    id: "L7-4-IDENTITY",
    blockId: "B7",
    title: "7.4: Environment Identity (Headless Grounding)",
    description: "A headless agent needs to know where it lives. Generate GEMINI.md at startup from the container environment so production rules override local habits.",
    example: "ENV=prod ./scripts/startup.sh",
    tasks: [
      {
        id: "T1",
        instruction: "Run the startup script in prod mode to inject Production Service Agent rules into GEMINI.md.",
        validate: (vfs, history) => {
          const file = vfs['/GEMINI.md'] as import('./vfsStore').FileNode;
          return !!file?.content.includes('Production Service Agent') &&
            !!file.content.includes('Never delete files in /app/data') &&
            history.some(h => h.content.includes('ENV=prod ./scripts/startup.sh'));
        },
        hint: "Execute `ENV=prod ./scripts/startup.sh` to let the virtual container write GEMINI.md."
      }
    ],
    feedback: {
      success: "\u2713 CONTAINER_IDENTITY_LOCKED. Gemini now knows it is a production service agent."
    }
  },
  {
    id: "L7-5-WORKER",
    blockId: "B7",
    title: "7.5: The Async Worker (Background Tasks)",
    description: "Long-running refactors do not belong inside the HTTP request/response loop. Use FastAPI BackgroundTasks to return 202 Accepted while the worker keeps healing state.",
    example: "curl -X POST /tasks/self-heal",
    tasks: [
      {
        id: "T1",
        instruction: "Trigger the self-healing worker and receive an immediate task_id.",
        validate: (vfs, history) => {
          return history.some(h => h.content.includes('202 Accepted')) &&
            history.some(h => h.content.includes('task_id')) &&
            history.some(h => h.content.includes('WORKER_LOG'));
        },
        hint: "POST to /tasks/self-heal. The Logic Feed becomes worker logs after the HTTP response closes."
      }
    ],
    feedback: {
      success: "\u2713 WORKER_DECOUPLED. The Signal continues after the request has already returned."
    }
  },
  {
    id: "L7-6-CORS",
    blockId: "B7",
    title: "7.6: The Security Perimeter (CORS)",
    description: "Browsers block unsafe cross-origin calls by default. Configure FastAPI CORSMiddleware so only the trusted frontend origin can reach the Agent Nexus.",
    example: "curl -X OPTIONS /signal -H 'Origin: http://localhost:5173'",
    tasks: [
      {
        id: "T1",
        instruction: "Configure CORSMiddleware with the trusted localhost frontend origin.",
        validate: (vfs) => {
          const file = vfs['/app/main.py'] as import('./vfsStore').FileNode;
          return !!file?.content.includes('CORSMiddleware') &&
            !!file.content.includes('http://localhost:5173');
        },
        hint: "Append CORSMiddleware configuration to app/main.py with localhost:5173 in allow_origins."
      },
      {
        id: "T2",
        instruction: "Send an OPTIONS preflight and confirm the Access-Control-Allow-Origin header.",
        validate: (vfs, history) => {
          return history.some(h => h.content.includes('OPTIONS /signal')) &&
            history.some(h => h.content.includes('Access-Control-Allow-Origin: http://localhost:5173'));
        },
        hint: "Use curl -X OPTIONS with an Origin header for http://localhost:5173."
      }
    ],
    feedback: {
      success: "\u2713 CORS_LOCKED. The browser bridge is open only to trusted origins."
    }
  },
  {
    id: "L7-7-AUTH",
    blockId: "B7",
    title: "7.7: The Locked Nexus (Authentication)",
    description: "Every unauthenticated request can drain tokens. Add a FastAPI Security dependency that checks X-API-Key before Gemini CLI is allowed to run.",
    tasks: [
      {
        id: "T1",
        instruction: "Follow the Security Audit feed to install the API key barrier.",
        validate: () => {
          const state = useLessonStore.getState();
          return state.currentLogicStepIdx >= 2 && state.agentStatus === 'SUCCESS';
        },
        hint: "Follow the Logic Feed exactly: write the header dependency, then test missing and invalid keys."
      }
    ],
    logicChain: [
      {
        step: 1,
        ai_thought: "THOUGHT: The API is exposed to the open web. I am detecting unauthorized pings. I must lock the Nexus before the tokens are depleted.",
        expected_action_type: "CODE_EDIT",
        required_command: "echo \"API_KEY_HEADER = APIKeyHeader(name='X-API-Key')\" >> app/main.py",
        hint: "Append the FastAPI APIKeyHeader dependency to app/main.py.",
        on_success: "OBSERVATION: Header dependency installed. The Nexus can now inspect incoming keys."
      },
      {
        step: 2,
        ai_thought: "THOUGHT: A missing key must fail before the subprocess boundary. Test the empty request path.",
        expected_action_type: "HTTP_AUDIT",
        required_command: "curl -X POST /signal",
        hint: "Send the request without X-API-Key.",
        on_success: "OBSERVATION: 401 Unauthorized. Empty signals are rejected before token spend."
      },
      {
        step: 3,
        ai_thought: "THOUGHT: A forged key is more dangerous than no key. Test the wrong secret and confirm the service refuses it.",
        expected_action_type: "HTTP_AUDIT",
        required_command: "curl -X POST /signal -H 'X-API-Key: wrong'",
        hint: "Send a wrong X-API-Key header.",
        on_success: "OBSERVATION: 403 Forbidden. Auth barrier active. The Signal is now a private channel."
      }
    ],
    feedback: {
      success: "\u2713 AUTH_ENFORCED. Intelligence tokens are protected by the Locked Nexus."
    }
  },
  {
    id: "L7-8-DOCKER",
    blockId: "B7",
    title: "7.8: Containerized Logic (Dockerfile)",
    description: "Package the brain for the cloud. Build a lightweight Debian-based container with Python, FastAPI dependencies, the official `@google/gemini-cli` package, and the STS.md brain file.",
    example: "judge Dockerfile",
    tasks: [
      {
        id: "T1",
        instruction: "Write a Dockerfile that installs `@google/gemini-cli` and copies STS.md into `/app`.",
        validate: (vfs) => {
          const file = vfs['/Dockerfile'] as import('./vfsStore').FileNode;
          return !!file?.content.includes('python:3.12-slim') &&
            !!file.content.includes('@google/gemini-cli') &&
            !!file.content.includes('COPY STS.md /app/STS.md') &&
            !!file.content.includes('USER');
        },
        hint: "Use a slim Python base, install the official npm package name, copy STS.md, and run as a non-root user."
      },
      {
        id: "T2",
        instruction: "Run the Dockerfile judge and pass the security/size checks.",
        validate: (vfs, history) => {
          return history.some(h => h.content.includes('DOCKERFILE_VALID')) &&
            history.some(h => h.content.includes('NON_ROOT_USER'));
        },
        hint: "Run `judge Dockerfile` to validate the virtual image layers."
      }
    ],
    feedback: {
      success: "\u2713 IMAGE_HARDENED. The headless brain is packaged for Cloud Run."
    }
  },
  {
    id: "L7-9-CLOUDRUN",
    blockId: "B7",
    title: "7.9: The Cloud Run Nexus (GCP Deployment)",
    description: "Deploy the container as a headless agentic service on Google Cloud Run. Secrets belong in Secret Manager, not .env files baked into images.",
    example: "gcloud run deploy nexus-agent --set-secrets GEMINI_API_KEY=gemini-api-key:latest",
    tasks: [
      {
        id: "T1",
        instruction: "Simulate a Cloud Run deployment with GEMINI_API_KEY mapped from Secret Manager.",
        validate: (vfs, history) => {
          return history.some(h => h.content.includes('gcloud run deploy')) &&
            history.some(h => h.content.includes('--set-secrets')) &&
            history.some(h => h.content.includes('SERVICE_LIVE'));
        },
        hint: "Use gcloud run deploy with --set-secrets GEMINI_API_KEY=gemini-api-key:latest."
      }
    ],
    feedback: {
      success: "\u2713 SERVICE_DEPLOYED. Cloud Run Nexus is live with secret-backed identity."
    }
  },
  {
    id: "L7-10-APOCALYPSE",
    blockId: "B7",
    title: "7.10: The Apocalypse (Load & Chaos Testing)",
    description: "The open web is concurrency, retries, and noise. Use a semaphore-backed queue so ten simultaneous signals do not spawn fifty uncontrolled Gemini subprocesses.",
    example: "python chaos.py --requests 10",
    tasks: [
      {
        id: "T1",
        instruction: "Run the chaos script and survive 10 simultaneous requests with the queue intact.",
        validate: (vfs, history) => {
          return history.some(h => h.content.includes('CHAOS_TEST')) &&
            history.some(h => h.content.includes('QUEUE_STABLE')) &&
            history.some(h => h.content.includes('AUTONOMOUS_IN_THE_WILD'));
        },
        hint: "Run `python chaos.py --requests 10` to test semaphore-limited concurrency."
      }
    ],
    feedback: {
      success: "\u2713 APOCALYPSE_SURVIVED. CORS_LOCKED | AUTH_ENFORCED | AUTONOMOUS_IN_THE_WILD."
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
  showAscension: boolean;
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
  setShowAscension: (show: boolean) => void;
  setView: (view: 'dashboard' | 'lesson') => void;
  setCurrentBlockId: (id: string) => void;
  setAgentStatus: (status: AgentStatus) => void;
  setCurrentLogicStepIdx: (idx: number) => void;
  setApiKey: (key: string | null) => void;
  setAuthMode: (authMode: boolean) => void;
  validateLogicStep: (blockId: string, lessonId: string, stepIdx: number, isFinal: boolean) => void;
  nextLesson: () => void;
  jumpToLesson: (idx: number) => void;
  validateCurrentTask: (vfs: VFSState, history: VFSStore['history'], currentPath: string) => boolean;
  setIsSuccessRaw: (success: boolean) => void;
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
      showAscension: false,
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
      setIsSuccessRaw: (isSuccess) => set({ isSuccess }),
      setIsDecrypting: (isDecrypting) => set({ isDecrypting }),
      setShowAscension: (showAscension) => set({ showAscension }),
      setView: (view) => set({ view }),
      setCurrentBlockId: (id) => set({ currentBlockId: id }),
      setAgentStatus: (status) => set({ agentStatus: status }),
      setCurrentLogicStepIdx: (idx) => set({ currentLogicStepIdx: idx }),
      setApiKey: (apiKey) => set({ apiKey }),
      setAuthMode: (authMode) => set({ authMode }),
      validateLogicStep: (blockId, lessonId, stepIdx, isFinal) => {
        if (isFinal) {
          // Final step complete! Set success IMMEDIATELY.
          set((state) => {
            const newCompleted = state.completedLessonIds.includes(lessonId)
              ? state.completedLessonIds
              : [...state.completedLessonIds, lessonId];
            
            return {
              isSuccess: true,
              isDecrypting: true,
              completedLessonIds: newCompleted,
              maxLessonIdx: Math.max(state.maxLessonIdx, state.currentLessonIdx + 1),
              showAscension: lessonId === 'L5-10-LEGACY'
            };
          });
        } else {
          // Increment step
          const isSpeedRun = typeof window !== 'undefined' && window.localStorage.getItem('STS_SPEED_RUN') === '1';
          setTimeout(() => {
            set({ 
              currentLogicStepIdx: stepIdx + 1,
              agentStatus: 'THINKING'
            });
          }, isSpeedRun ? 100 : 1500);
        }
      },
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
        if (state.isSuccess) return true;

        const currentLesson = LESSONS[state.currentLessonIdx];
        if (!currentLesson) return false;

        // Special case for logicChain lessons: they are validated via validateLogicStep
        if (currentLesson.logicChain) {
          // If we are at the final step and logic step handler hasn't set success yet,
          // but we want to check it here just in case.
          return state.isSuccess; 
        }

        const currentTask = currentLesson.tasks[state.currentTaskIdx];
        if (!currentTask) return false;

        if (currentTask.validate(vfs, history, currentPath)) {
          // Task completed!
          if (state.currentTaskIdx < currentLesson.tasks.length - 1) {
            set({ currentTaskIdx: state.currentTaskIdx + 1 });
            return false; // Not lesson complete, just task complete
          } else {
            // Lesson complete!
            const lessonId = currentLesson.id;
            const newCompleted = state.completedLessonIds.includes(lessonId)
              ? state.completedLessonIds
              : [...state.completedLessonIds, lessonId];

            set({
              isSuccess: true,
              isDecrypting: true,
              completedLessonIds: newCompleted,
              maxLessonIdx: Math.max(state.maxLessonIdx, state.currentLessonIdx + 1),
              showAscension: currentLesson.id === 'L5-10-LEGACY'
            });
            return true;
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
        isSuccess: state.isSuccess,
        view: state.view,
        currentBlockId: state.currentBlockId,
        currentLogicStepIdx: state.currentLogicStepIdx,
        agentStatus: state.agentStatus
      }),
    }
  )
);
