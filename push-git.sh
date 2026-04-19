#!/bin/zsh

set -euo pipefail

branch="$(git branch --show-current)"
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: ./push-git.sh \"Commit message\""
  echo "   or: npm run push -- \"Commit message\""
  exit 0
fi

message="${1:-Update map project}"

if [[ -z "$branch" ]]; then
  echo "No current git branch found."
  exit 1
fi

echo ""
echo "Current branch: $branch"
echo "Commit message: $message"
echo ""
echo "Staging changes..."
git add -A

if git diff --cached --quiet; then
  echo "No staged changes to commit."
else
  echo "Committing..."
  git commit -m "$message"
fi

echo "Rebasing onto origin/$branch..."
git pull --rebase origin "$branch"

echo "Pushing to origin/$branch..."
git push origin "$branch"

echo ""
echo "Done."
