<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:signal-to-shell-rules -->
# Signal to Shell Architecture Findings

1. **State Management**: The project utilizes Zustand (`vfsStore.ts`, `lessonStore.ts`) for VFS and Curriculum progression.
2. **Curriculum Structure**: Lessons are organized into 5 Blocks (Deployment Phases):
   - B1: Expectation (Basics)
   - B2: Let It Happen (Stream Control)
   - B3: Mind Mischief (Logic Signals)
   - B4: The Moment (Gemini Protocol)
   - B5: Tomorrow's Dust (Agentic Orchestration)
3. **UI / Aesthetics**: Cyberpunk "Netrunner Nexus" design (`bg-[#050505]`, `text-[#00FF9F]`, `font-mono`). Block 5 uses a Dusted Gold (`#D4AF37`) palette.
4. **Validation Logic**: `vfsStore.ts` centralizes logic step validation to ensure atomic state updates for multi-step lessons.
5. **Testing**: 39+ tests covering 5 blocks. Playwright tests use a 10s UI timeout limit.
<!-- END:signal-to-shell-rules -->
