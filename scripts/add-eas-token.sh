#!/bin/bash

# CONFIG - UPDATE THESE
GITHUB_USER="Savitarx7"             # <-- your GitHub username
REPO_NAME="genesisapp"              # <-- your GitHub repo name

# Step 1: Ensure eas-cli is installed
if ! command -v eas &> /dev/null; then
  echo "Installing eas-cli..."
  npm install -g eas-cli
fi

# Step 2: Log into Expo if not already
if ! eas whoami &> /dev/null; then
  echo "Logging into Expo CLI..."
  eas login
fi

# Step 3: Create access token
echo "Creating EAS token..."
EAS_TOKEN=$(eas token:create --non-interactive --name "GitHub CI" | tail -n 1)

if [[ -z "$EAS_TOKEN" ]]; then
  echo "❌ Failed to create EAS token."
  exit 1
fi

# Step 4: Install GitHub CLI if needed
if ! command -v gh &> /dev/null; then
  echo "Installing GitHub CLI..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install gh
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo apt install gh -y
  else
    echo "Please install GitHub CLI manually: https://cli.github.com/"
    exit 1
  fi
fi

# Step 5: Authenticate GitHub CLI
if ! gh auth status &> /dev/null; then
  echo "Authenticating GitHub CLI..."
  gh auth login
fi

# Step 6: Add secret to GitHub
echo "Uploading token to GitHub repo secret..."
gh secret set EAS_ACCESS_TOKEN -b"$EAS_TOKEN" -R "$GITHUB_USER/$REPO_NAME"

echo "✅ EAS_ACCESS_TOKEN successfully added to GitHub Secrets for $GITHUB_USER/$REPO_NAME"
