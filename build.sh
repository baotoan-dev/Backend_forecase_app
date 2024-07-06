#!/bin/bash
sudo git pull
sudo rm -r src-built
sudo mkdir -p build 
sudo npx tsc
sudo cp -r src/swagger build/src
sudo mv build/src build/src-built
sudo mv build/src-built .