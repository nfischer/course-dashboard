:: Set up everything necessary for runnning the backend and then launch it with a
:: fresh database

SET "DATABASE_FILE=course-dashboard.db"
SET "DB_FOLDER=db"
SET "SCHEMA_FILE=schema.sql"

mkdir %DB_FOLDER%
sqlite3 %DB_FOLDER%/%DATABASE_FILE% < %SCHEMA_FILE%
python cdApp.py