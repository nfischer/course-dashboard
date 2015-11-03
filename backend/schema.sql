drop table if exists nodes;
drop table if exists children;
drop table if exists links;
CREATE TABLE `nodes` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `contents` VARCHAR(300),
    `renderer` VARCHAR(50),
    `course_id` INTEGER,
    `isalive` INTEGER,
    `isroot` INTEGER,
    `children` TEXT
);
CREATE TABLE `links` (
    `origin` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `dest` INTEGER,
    FOREIGN KEY(origin) REFERENCES nodes(node_id),
    FOREIGN KEY(dest) REFERENCES nodes(id)
);

CREATE TABLE `children` (
    `parent_id` INTEGER NOT NULL,
    `children`  TEXT,
    PRIMARY KEY(parent_id),
    FOREIGN KEY(`parent_id`) REFERENCES nodes ( 'id' )
);


PRAGMA foreign_keys = ON;
