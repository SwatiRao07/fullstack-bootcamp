# Server & Process Basics - Key Learnings

## 1. Processes
- **Concept**: A process is a running instance of a program.
- **Inspection**:
  - `ps`: Snapshot of current processes.
  - `top` / `htop`: Real-time view of system resources and running tasks.
- **Management**:
  - `kill <pid>`: Stop a responsive or stuck process using its Process ID (PID).
  - Background vs. Foreground execution is key for long-running servers.

## 2. Ports & Networking
- **Role**: Ports are digital "doors" where servers listen for incoming requests (e.g., Port 3000 for local dev).
- **Common Issues**:
  - "Port already in use": Means another process is occupying that port.
  - **Fix**: Identify the process (using `lsof -i :<port>` or similar) and stop it.

## 3. Users & Permissions
- **Identity**:
  - `whoami`: Checks the current active user.
  - **Root**: The superuser with unlimited privileges.
- **File Permissions**:
  - **Read (`r`)**: Can view file contents.
  - **Write (`w`)**: Can modify contents.
  - **Execute (`x`)**: Can run the file as a program/script.
  - **View**: Use `ls -l` to see permission flags (e.g., `-rwxr-xr--`).
- **Modification**: Change permissions when scripts are "not executable" or access is denied.

## 4. Sudo & Security
- **Rule of Thumb**: Avoid `sudo` unless strictly necessary (e.g., system-wide installs).
- **Risk**: Running regular development commands with `sudo` can mess up file ownership, leading to "Permission Denied" errors later.
- **Privilege Boundaries**: Understand the difference between user-space (your code) and system-space (OS configuration).
