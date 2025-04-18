#!/bin/sh

set -e

mkdir -p ./dist/python

pyinstaller --clean --distpath ./python/dist -F ./python/src/main.py
cp ./python/dist/main ./dist/python/main
rm -rf ./build
rm ./main.spec || true
