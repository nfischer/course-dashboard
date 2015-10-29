#!/bin/bash

# Set up everything necessary for runnning the backend and then launch it with a
# fresh database

DATABASE_FILE="course-dashboard.db"
DB_FOLDER="db"
SCHEMA_FILE="schema.sql"

mkdir -p "${DB_FOLDER}/"
sqlite3 "${DB_FOLDER}/${DATABASE_FILE}" < "${SCHEMA_FILE}"
python cdApp.py
