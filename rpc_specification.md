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

 - end point: `/node/add/`
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

 - end point: `/node/get/<id>/` where `<id>` is some integer
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

### Editing/Updating a node

 - end point: `/node/update/<id>/` where `<id>` is some integer
 - request: HTTP POST
 - data (input):
```
{
  "contents": "new contents",
  "renderer": "new renderer",
  "children": "{ 'foo': '1', 'bar': '2', ... }"
}
```
 - return data:
```
{
  "message": "Node was successfully updated",
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

 - end point: `/tree/`
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
