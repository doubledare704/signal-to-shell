# Signal to shell: Design Stitch File

This document defines the atomic design tokens and structural patterns for the "Signal to shell" platform. Use these constants to ensure visual consistency across all modules.

## 1. Visual Identity & Tone

- **Expressive Words:** Neon-Grid, Analog-Futurism, High-Density, Haptic, Glitch-Safe.
- **Core Concept:** A high-end terminal interface that feels like a "Signal to shell Deck." It should be dark, high-contrast, and feel physically responsive to user input.

## 2. The Color Palette (Tailwind Tokens)

Apply these using `bg-{color}`, `text-{color}`, or `border-{color}`.

| Token | Hex | Tailwind Utility | Semantic Usage |
| :--- | :--- | :--- | :--- |
| **Void Black** | `#050505` | `bg-[#050505]` | Core Page Background |
| **Surface** | `#0A0A0A` | `bg-[#0A0A0A]` | Sidebar, Modals, Card Backgrounds |
| **Border High** | `#1A1A1A` | `border-[#1A1A1A]` | Primary Dividers & Grid Lines |
| **Matrix Green** | `#00FF9F` | `text-[#00FF9F]` | Success, Primary Action, Prompts |
| **Cyber Pink** | `#FF00FF` | `text-[#FF00FF]` | Error, Critical Alert, AI Thinking |
| **Glitch Blue** | `#00D1FF` | `text-[#00D1FF]` | Info, Links, Folders, Metadata |
| **Muted Text** | `#666666` | `text-gray-500` | Secondary Info, Breadcrumbs |

## 3. Typography

Use Google Fonts to maintain the "Signal to shell" vibe.

- **Display/Headings:** Orbitron (Weight: 700) - Usage: Page Titles, Level Indicators.
- **Interface UI:** Rajdhani (Weight: 500, 600) - Usage: Buttons, Sidebar Labels, Stats.
- **Mono/Code:** JetBrains Mono or Fira Code - Usage: Terminal, Code Blocks, VFS paths.
- **Reading/Docs:** Inter - Usage: Long-form instructional text.

## 4. Component Patterns

### 4.1 The "Glass-Grid" Container

Every panel should feel like a piece of hardware.

```css
.signal-shell-panel {
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid #1A1A1A;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
}
```

### 4.2 The "Neon Success" Button

```html
<button class="bg-[#00FF9F] text-black font-bold uppercase tracking-tighter px-4 py-2 hover:shadow-[0_0_15px_#00FF9F] transition-all duration-300">
  Initialize Node
</button>
```

### 4.3 The "CRT Overlay" (Global)

Add this to the root layout to give the whole app a subtle hardware texture.

```css
.crt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 25%),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.06),
      rgba(0, 255, 0, 0.02),
      rgba(0, 0, 255, 0.06)
    );
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
  opacity: 0.05;
  z-index: 100;
}
```

## 5. Interaction & Motion Rules

| Interaction | Visual Feedback | CSS Property |
| :--- | :--- | :--- |
| **Click / Tap** | Brief "Flash" of Matrix Green | `transition: background 0.1s` |
| **Command Success** | Border pulses Green | `animate-pulse` (custom keyframe) |
| **Command Error** | Text briefly jitters | `animate-shake` (glitch effect) |
| **AI Thinking** | Pink horizontal loading bar | `linear-gradient` animation |
| **Page Transition** | Horizontal scanline wipe | `clip-path` animation |

## 6. Icons (Lucide-React Mapping)

- **Files:** `FileText` (Muted Color)
- **Directories:** `FolderTree` (Glitch Blue)
- **AI/Gemini:** `Cpu` or `Eye` (Cyber Pink)
- **Status:** `CheckCircle2` (Matrix Green) / `AlertCircle` (Cyber Pink)
- **Navigation:** `ChevronRight` (Muted)

## 7. Responsive Breakpoints

- **Mobile (< 768px):** Hide Sidebar, move Terminal to bottom-drawer.
- **Desktop (> 1024px):** Triple-pane layout (Docs \| Terminal \| File Tree).

---

### Global Styles

```css
/* STREAMING_CHUNK: Defining base cyberpunk styles... */
:root {
  --color-matrix: #00FF9F;
  --color-pink: #FF00FF;
  --color-blue: #00D1FF;
  --bg-void: #050505;
}

body {
  background-color: var(--bg-void);
  color: white;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* STREAMING_CHUNK: Adding CRT Scanline Animation... */
@keyframes scanline {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.scanline-effect::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(0, 255, 159, 0.1);
  animation: scanline 8s linear infinite;
  pointer-events: none;
}

/* STREAMING_CHUNK: Defining custom utility for neon glow... */
.glow-green {
  box-shadow: 0 0 10px rgba(0, 255, 159, 0.3);
}

.glow-pink {
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
}
```
