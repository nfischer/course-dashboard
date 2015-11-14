RPC Specification
=================

About
-----

This is a specification to make sure the frontend and backend agree on which
rpcs will be used to communicate between the two endpoints. This document should
be updated by either team after discussion about ramifications of each change.

Nodes
-----

### Adding a node

 - end point: `/<course_id>/node/add/`, where `<course_id>` is some integer
 - request: HTTP POST
 - data (input):
```
{
  "contents": "foo",
  "renderer": "bar"
}
```
 - return data:
```
{
  "message": "New node was successfully created",
  "id": 1
}
```
 - Node ID will be auto-assigned (constantly increasing)

### Accessing a node

 - end point: `/<course_id>/node/get/<id>/` where `<course_id>` and `<id>` are
   some integers
 - request: HTTP GET
 - data (input): none
 - return data:
```
{
  "children": "73",
  "contents": "foo",
  "id": 3,
  "renderer": "bar"
}
```
 - No two nodes can have the same ID
 - If you request a non-existent node, you get an exception

### Deleting a node

 - end point: `/<course_id>/node/delete/<id>/` where `<course_id>` and `<id>`
   are some integers
 - request: HTTP POST
 - data (input): None
 - return data:
```
{
  "message": "Node was successfully deleted.",
  "id": "1"
}
```

Children
--------

### Adding children

 - Please see "Editing a node"

### Editing a node's children

 - Please see "Editing a node"

Tree
----

### Accessing all nodes (aka the tree)

 - end point: `/<course_id>/tree/`, where `<course_id>` is some integer
 - request: HTTP GET
 - data (input): none
 - return data:
```
{
  "rootId": "0",
  "nodes":
    [
      {
        "renderer": "r",
        "children": "2",
        "contents": "foo",
        "id": 1
      },
      ... more nodes
    ]
}
```

Root
----

### Viewing the list of tree roots

 - end point: `/<course_id>/root/get/`, where `<course_id>` is some integer
 - request: HTTP GET
 - data (input): none
 - return data:
```
[
  {
    "id": 3,
    "renderer": "bar"
  },
  {
    "id": 8,
    "renderer": "foo"
  }
  ...
]
```

### Setting a node to be a root

 - end point: `/<course_id>/root/set/<id>/` where `<id>` is some integer
 - request: HTTP POST
 - data (input): None
 - return data:
```
{
  "message": "Successfully labeled node as a root.",
  "id": "1"
}
```

### Setting a node to no longer be a root (deletion)

 - end point: `/<course_id>/root/delete/<id>/` where `<course_id>` and `<id>`
   are some integers
 - request: HTTP POST
 - data (input): None
 - return data:
```
{
  "message": "Successfully removed root label.",
  "id": "1"
}
```

Piazza Integration
------------------

### Create a brand new course

 - end point: `/0/course/add/`. **Note**: this must use the fake course ID `0`
 - request: HTTP POST
 - data (input): None
 - return data:
```
{
  "message": "New course was successfully initialized",
  "course_id": "1"
}
```

### Adding a Piazza course ID

 - end point: `/<course_id>/course/setpiazza/`, where `<course_id>` is some integer
 - request: HTTP POST
 - data (input):
```
{
  "piazza_cid": "123456789"
}
```
 - return data:
```
{
  "message": "Successfully added piazza ID for course",
  "course_id": "1"
}
```
 - This will fail if the course already has a Piazza ID (because we don't want
   to overwrite it unless we **really** mean to)

### Restting a Piazza course ID

 - end point: `/<course_id>/course/resetpiazza/` where `<course_id>` is an integer
 - request: HTTP POST
 - data (input):
```
{
  "piazza_cid": "123456789"
}
```
 - return data:
```
{
  "message": "Successfully added piazza ID for course",
  "course_id": "1"
}
```
 - This will fail if the course ID is not already present (by design to prevent
   this from being accidentally changed)

### Accessing

 - end point: `/<course_id>/course/getpiazza/` where `<course_id>` is some integer
 - request: HTTP GET
 - data (input): None
 - return data:
```
{
  "message": "Returning piazza ID for course",
  "course_id": "1",
  "piazza_cid": "123456789"
}
```

### Accessing Piazza Post Data

- end point: `/<course_id>/course/getpiazzaposts/` where `<course_id>` is some integer
- request: HTTP GET
- data (input): None
- return data:
streaming json objects for each post in the class
