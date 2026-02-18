# Daily Git Workflow

## The Core Loop
Follow this disciplined cycle for every single task or change.

1.  **Edit**: Write code, fix bugs, or update text in your editor.
2.  **Status**: Check which files are modified.
    ```bash
    git status
    ```
3.  **Stage (Add)**: Prepare files for the snapshot.
    ```bash
    git add <filename>
    # OR to stage everything (be careful)
    git add .
    ```
4.  **Commit**: Save the snapshot with a descriptive message.
    ```bash
    git commit -m "feat: add user login form"
    ```
5.  **Push**: Upload changes on GitHub to back them up immediately.
    ```bash
    git push origin main
    ```

## Branching Workflow (Feature Work)
Never work directly on `main` for complex features.

1.  **Create Branch**: `git checkout -b feature/new-design`
2.  **Work**: Update files, add, and commit as usual.
3.  **Push Branch**: `git push origin feature/new-design`
4.  **Pull Request**: Open a PR on GitHub to merge into `main`.
5.  **Merge**: After review, merge the PR and pull the updated `main` locally.
    ```bash
    git checkout main
    git pull origin main
    ```

## Key Rules
- **Commit Often**: Small, logical commits are easier to fix than massive ones.
- **Clear Messages**: Describe *what* and *why*, not just "changes".
- **Pull First**: Before starting new work, always run `git pull` to get the latest code.
