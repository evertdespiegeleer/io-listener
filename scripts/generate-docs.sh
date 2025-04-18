#!/usr/bin/env bash

set -e

# Copy example contents into templated readme file
npx embedme --stdout --strip-embed-comment ./readme.tpl.md > ./readme.md

library_name=$(jq -r '.name' package.json)

# Replace relative paths in readme file with npm package name
cp ./readme.md ./readme.md.tmp
cat ./readme.md.tmp | node -e "process.stdout.write(fs.readFileSync(0).toString().replaceAll('../src/main.ts', '$library_name') + '\n')" > ./readme.md
rm ./readme.md.tmp