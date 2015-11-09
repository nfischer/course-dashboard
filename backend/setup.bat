::Set up everything necessary for runnning the backend and then launch it with a
::fresh database


set DATABASE_FILE=course-dashboard.db
set DB_FOLDER=db
set SCHEMA_FILE=schema.sql

mkdir %DB_FOLDER%\
sqlite3 %DB_FOLDER%\%DATABASE_FILE% < %SCHEMA_FILE%
python cdApp.py
