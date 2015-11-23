DROP TABLE IF EXISTS nodes;
DROP TABLE IF EXISTS courses;

CREATE TABLE `nodes` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `contents` VARCHAR(300),
    `renderer` VARCHAR(50),
    `course_id` INTEGER,
    `isalive` INTEGER,
    `isroot` INTEGER,
    `children` TEXT,
    FOREIGN KEY(course_id) REFERENCES courses(course_id)
);

CREATE TABLE `courses` (
    `course_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `piazza_cid` VARCHAR(100) NOT NULL,
    `course_name` VARCHAR(100) NOT NULL
);

PRAGMA foreign_keys = ON;
