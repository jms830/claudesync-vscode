# ClaudeSync VS Code Feature Roadmap

## Guiding Principles
- Clarity first: explicit commands and safe defaults.
- Workspace-first: operate across multiple projects.
- Fast feedback: status bar, progress, diffs, cancelation.
- Predictable: confirmations for destructive actions; dry-run preview.

## Phases
- Phase 1: Core sync (two-way/push/pull), conflict UI, status bar, CLAUDE.md prompt sync, auth refresh.
- Phase 2: Workspace tree view (orgs/projects), parallel sync, clone from org, discover projects.
- Phase 3: Chat panel (list/pull/export/new/send), watch/schedule commands.
- Phase 4: Categories UI (selective sync), diagnostics (Doctor/Check), submodule awareness.

## Commands & UI
- Sync: "Sync (Two-Way)", "Push", "Pull", "Resolve Conflicts", "Show Sync Status".
- Workspace: "Workspace: Sync All", "Clone From Org", "Discover Projects", "Status"; tree view with context actions.
- Auth/Project: "Login (Session Key)", "Refresh Session", "Logout", "Select Organization/Project", "Open in Browser".
- Chats: "Chats: List/Pull/Export/New/Send"; chats panel.
- Watch/Schedule: "Watch: Start/Stop/Status", "Schedule: Enable/Disable".

## Settings (examples)
- `claudesync.conflictStrategy`: prompt | local-wins | remote-wins
- `claudesync.cleanupRemoteFiles`: boolean (confirm on first use)
- `claudesync.concurrency`: number (parallel uploads)
- `claudesync.workspaceRoot`: string; `claudesync.parallelSync`: boolean
- `claudesync.categories`: { name: { patterns: string[] } }

## Quality & Diagnostics
- Output channel per operation with structured summaries.
- "ClaudeSync: Doctor" verifies token, org/project, API access, excludes, file limits.
- Dry-run previews; confirmations for truncate/delete.
