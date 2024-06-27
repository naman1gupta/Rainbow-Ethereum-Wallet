#!/bin/bash

# Variables
BATCH_SIZE=4
COMMIT_MESSAGE="Commit"
BRANCH="main"

# Initialize counters
count=0
batch_number=1

# Function to add and commit files
add_and_commit() {
  git add "$@"
  git commit -m "${batch_number} ${COMMIT_MESSAGE}"
  batch_number=$((batch_number + 1))
}

# Iterate through all files and folders
for item in *; do
  if [ -d "$item" ] || [ -f "$item" ]; then
    if [ $((count % BATCH_SIZE)) -eq 0 ] && [ $count -ne 0 ]; then
      add_and_commit "${batch[@]}"
      batch=()
    fi
    batch+=("$item")
    count=$((count + 1))
  fi
done

# Commit remaining files if any
if [ ${#batch[@]} -ne 0 ]; then
  add_and_commit "${batch[@]}"
fi

# Push to the specified branch
git push origin "$BRANCH"
