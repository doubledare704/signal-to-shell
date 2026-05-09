<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:signal-to-shell-rules -->
# Signal to Shell Architecture Findings

1. **State Management**: The project heavily utilizes Zustand (`vfsStore.ts`, `lessonStore.ts`) for both the Virtual File System (VFS) and Curriculum progression. VFS changes must be handled immutably (e.g. recursive copies/moves).
2. **Curriculum Structure**: Lessons are defined as an array of `tasks` (SubTasks) rather than a single monolithic check. Each task must have its own `validate` function checking both `vfs` and command `history`.
3. **UI / Aesthetics**: We strictly adhere to the "Netrunner Nexus" Cyberpunk design system (`bg-[#050505]`, `text-[#00FF9F]`, `font-mono`). Do not use Tailwind default colors like `text-green-500`; instead use the `THEME` object defined in components.
4. **Validation Logic**: `judgeEngine.ts` bridges the VFS changes to lesson progression. It triggers audio signals per sub-task. Deep environment checks (VFS state + history) are preferred over simple presence checks to prevent terminal false positives.
5. **Animations**: The `DecryptText` component relies on a word-by-word decryption algorithm. Always prefer clean and rapid animations (`0.5` ticks per interval) rather than slow letter-by-letter setups to enhance user engagement.
<!-- END:signal-to-shell-rules -->
