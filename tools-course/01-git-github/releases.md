# Git Releases & Versioning

## Purpose
Releases mark specific, stable points in your project's history (e.g., v1.0, v2.0 beta). They are snapshot milestones that users or developers can rely on.

## Workflow

### 1. Create a Key Point (Tag)
Use **Annotated Tags** for releases, as they store the tagger's name, email, date, and a message.
```bash
# Syntax: git tag -a <version> -m "<message>"
git tag -a v0.1.0 -m "Initial beta release"
```

### 2. Push to GitHub
Tags are not pushed by default with standard commits. You must push them explicitly.
```bash
# Push a specific tag
git push origin v0.1.0

# OR push all tags
git push origin --tags
```

### 3. Publish on GitHub
1.  Go to the **Releases** section on your GitHub repository page.
2.  Click **Draft a new release**.
3.  Choose the tag you just pushed (`v0.1.0`).
4.  Add a title and description (changelog) of what's new.
5.  Click **Publish release**.

## Naming Convention
- Use **Semantic Versioning** (SemVer) broadly: `vMajor.Minor.Patch`
  - **v1.0.0**: Breaking changes.
  - **v0.1.0**: New features (backward compatible).
  - **v0.0.1**: Bug fixes.
