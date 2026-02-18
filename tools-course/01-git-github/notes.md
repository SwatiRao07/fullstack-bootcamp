# Git & GitHub Module - Key Learnings

## 1. Environment Setup
- **GitHub Account**: Use a professional username and add a bio.
- **SSH Keys**: Essential for secure, password-less interaction with GitHub (Linux/macOS).
- **Global Config**: Set `user.name` and `user.email` immediately to identify your commits.

## 2. Project Structure & Naming
- **Strict Naming Rules**:
  - Lowercase only.
  - Use hyphens (`-`) or underscores (`_`).
  - **NO SPACES**: Spaces break command-line tools and automation scripts.
- **Directory Hierarchy**:
  - Keep course work organized, e.g., `fullstack/tools-course/03-git-github/`.
  - Initialize Git at the **root** of the repository, not inside subfolders.

## 3. The Git Workflow
Standard disciplined cycle for every change:
1. **Edit**: Make changes to files.
2. **Status**: Check what changed (`git status`).
3. **Add**: Stage changes (`git add <file>` or `git add .`).
4. **Commit**: Save changes with a clear message (`git commit -m "..."`).
5. **Push**: Upload to GitHub (`git push`).

## 4. Branching Strategy
- **Why**: Isolate features or experiments from stable code.
- **Process**:
  1. Create branch: `git checkout -b feature/workflow-update`
  2. Work, commit, push.
  3. Merge: Switch to `main` and merges the feature branch.
- **Conflict Resolution**: Learn to handle edits to the same line in different branches.

## 5. Ignoring Files (.gitignore)
- **Purpose**: Prevent clutter and security risks.
- **What to Ignore**:
  - Dependencies (`node_modules/`)
  - Environment secrets (`.env`)
  - System files (`.DS_Store`)
  - Logs (`*.log`)
- **Binary Files**: **Do not commit** large binaries (videos, zips, compiled executables). Git is optimized for text diffs, not binary blobs.

## 6. History & Releases
- **Inspection**: Use `git log`, `git diff`, and `git show` to review project history.
- **Releases**:
  - Use **Tags** for versioning (e.g., `v0.1.0`).
  - Push tags and create formal Releases on GitHub to mark stable points in development.


