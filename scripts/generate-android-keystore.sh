#!/bin/bash
set -euo pipefail

KEYSTORE_PATH="${KEYSTORE_PATH:-./credentials/android.keystore}"
KEY_ALIAS="${KEY_ALIAS:-mykey}"
KEYSTORE_PASSWORD="${KEYSTORE_PASSWORD:-password123}"
KEY_PASSWORD="${KEY_PASSWORD:-password123}"

if [ ! -f "$KEYSTORE_PATH" ]; then
  mkdir -p "$(dirname "$KEYSTORE_PATH")"
  keytool -genkeypair -v -keystore "$KEYSTORE_PATH" \
    -alias "$KEY_ALIAS" -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass "$KEYSTORE_PASSWORD" -keypass "$KEY_PASSWORD" \
    -dname "CN=Unknown, OU=Unknown, O=Unknown, L=Unknown, S=Unknown, C=US"
fi

cat > credentials.json <<JSON
{
  "android": {
    "keystore": {
      "keystorePath": "$KEYSTORE_PATH",
      "keystorePassword": "$KEYSTORE_PASSWORD",
      "keyAlias": "$KEY_ALIAS",
      "keyPassword": "$KEY_PASSWORD"
    }
  }
}
JSON

