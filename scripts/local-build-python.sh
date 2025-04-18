#!/bin/sh

set -e

mkdir -p ./dist/python

pyinstaller --clean --distpath ./python/dist -F -n "$OSTYPE" ./python/src/main.py

cp ./python/dist/* ./dist/python
rm -rf ./build
rm ./main.spec || true
