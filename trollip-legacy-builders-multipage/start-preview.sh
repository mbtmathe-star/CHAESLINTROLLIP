#!/usr/bin/env bash
cd "$(dirname "$0")"
echo "Trollip Legacy Builders preview server"
echo "Open: http://localhost:5500/"
python3 -m http.server 5500
