#!/bin/bash
set -euo pipefail

if ! npx -y eas-cli whoami >/dev/null 2>&1 && [ -z "${EXPO_TOKEN:-}" ]; then
  echo "Expo authentication required. Run 'eas login' or set EXPO_TOKEN." >&2
  exit 1
fi

./scripts/generate-android-keystore.sh

npx -y eas-cli build --platform android --profile development --local --non-interactive --output build-output.apk "$@"
