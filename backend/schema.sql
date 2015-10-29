drop table if exists nodes;
drop table if exists children;
drop table if exists links;
CREATE TABLE nodes (
    node_id integer primary key autoincrement,
    contents varchar(300),
    renderer varchar(50)
);
CREATE TABLE links (
    origin int NOT NULL,
    name varchar(100) NOT NULL,
    dest int,
    foreign key(origin) references nodes(node_id),
    foreign key(dest) references nodes(node_id)
);

CREATE TABLE `children` (
	`parent_id`	INTEGER NOT NULL,
	`children`	TEXT,
	PRIMARY KEY(parent_id),
	FOREIGN KEY(`parent_id`) REFERENCES nodes ( 'node_id' )
);


PRAGMA foreign_keys = ON;
