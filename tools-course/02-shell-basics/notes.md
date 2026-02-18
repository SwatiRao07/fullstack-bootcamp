# Shell Basics - Key Learnings

## 1. Navigation & Pathing
- **Core Commands**:
  - `pwd`: Print working directory (where am I?).
  - `ls`: List files (`ls -a` for hidden, `ls -l` for details).
  - `cd`: Change directory.
- **Paths**:
  - **Absolute**: Full path starting from root (e.g., `/users/name/project`).
  - **Relative**: Path relative to current location (e.g., `./folder`, `../parent`).

## 2. File Manipulation
- **Create**: `mkdir foldername` (directories), `touch filename` (empty files).
- **Move/Rename**: `mv oldname newname` or `mv file folder/`.
- **Copy**: `cp source dest` (files), `cp -r source dest` (recursive for folders).
- **Delete**: `rm filename`. **Warning**: `rm -rf` is dangerous and permanent.

## 3. Viewing & Inspection
- **Cat**: Dump entire file content (`cat file.txt`).
- **Less**: Scrollable view for large files (`less file.txt`).
- **Head/Tail**: View start/end of file (`head -n 5 file.txt`).
- **Word Count**: `wc` counts lines, words, and characters.

## 4. Power Tools: Pipes & Redirection
- **Pipe (`|`)**: Pass the output of one command as input to another.
  - *Example*: `cat largefile.txt | grep "error"`
- **Redirection**:
  - `>`: Overwrite file with output.
  - `>>`: Append output to end of file.

## 5. Productivity & Config
- **History**: Use `history` to see past commands.
- **Search**: Press `Ctrl+R` to reverse search through command history.
- **Configuration**:
  - Shell settings live in `.bashrc` or `.zshrc`.
  - **Aliases**: Shortcuts for long commands (defined in config files).
- **Safety**: Avoid using `sudo` unless absolutely necessary for system administration.
