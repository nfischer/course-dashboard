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

 - end point: `/node/`
 - request: HTTP PUT
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
 - Node ID will be auto-assigned (monotonically increasing)

### Accessing a node

 - end point: `/node/<id>/` where `<id>` is some integer
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

### Editing a node

 - end point: `/node/<id>/` where `<id>` is some integer
 - request: HTTP POST
 - data (input):
```
{
  "contents": "new contents",
  "renderer": "new renderer",
  "children":
  {
    "foo": "1",
    "bar": "2",
    ...
  }
}
```
 - return data:
```
{
  "message": "Node was successfully updated",
  "id": "1"
}
```
 - Warning: this is not yet fully implemented. It will currently delete all
   links to child nodes and not reestablish them

Children
--------

### Adding children

 - end point: `/children/<id>/` where `id` is the parent's id
 - request: HTTP PUT
 - data (input):
```
{
  "children": "7",
}
```
 - return data:
```
{
  "message": "Children were successfully added to the node",
  "id": "4"
}
```

### Editing a node's children

 - end point: `/children/<id>/` where `id` is the parent's id
 - request: HTTP POST
 - data (input):
```
{
  "children": "7",
}
```
 - return data:
```
{
  "message": "Children were successfully updated.",
  "id": "4"
}
```

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
