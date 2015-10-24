drop table if exists nodes;
drop table if exists links; 
CREATE TABLE nodes (
    node_id integer primary key autoincrement, 
    contents varchar(300), 
    renderer varchar(50)
);
CREATE TABLE links (
    origin int, 
    name varchar(100), 
    dest int,
    foreign key(origin) references nodes(node_id),
    foreign key(dest) references nodes(node_id)
);
PRAGMA foreign_keys = ON;