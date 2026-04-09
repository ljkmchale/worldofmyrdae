---
name: sync
description: Pull latest changes from GitHub, then commit and push any local changes to master. Use after editing locations in the editor UI to keep GitHub in sync.
argument-hint: [optional commit message]
---

Sync the World of Myrdae project with GitHub master. This pulls remote changes, commits any local edits, and pushes — all in one step.

## Steps

1. **Check for local changes:**
   ```bash
   git -C "/Users/larrymchale/Desktop/worldofmyrdae-master" status --short
   ```

2. **Pull latest from remote first:**
   ```bash
   git -C "/Users/larrymchale/Desktop/worldofmyrdae-master" pull origin master
   ```
   If there are merge conflicts, stop and report them to the user clearly.

3. **If there are local changes, stage and commit them:**
   - Stage all modified tracked files:
     ```bash
     git -C "/Users/larrymchale/Desktop/worldofmyrdae-master" add js/ css/ *.html .claude/skills/
     ```
   - Use the commit message from $ARGUMENTS if provided, otherwise generate a short descriptive one based on what files changed (e.g. "Update locations database", "Edit map overlay styles", etc.)
   - Commit with that message plus the Co-Authored-By trailer.

4. **Push to master:**
   ```bash
   git -C "/Users/larrymchale/Desktop/worldofmyrdae-master" push origin master
   ```

5. **Report to the user:**
   - What changed (which files, how many lines)
   - The commit hash and message
   - Confirm "Pushed to master ✓"

   If nothing changed locally, just say "Already up to date — nothing to commit."

## Notes
- Always pull before committing to avoid conflicts
- Never force push
- If $ARGUMENTS is provided, use it as the commit message
