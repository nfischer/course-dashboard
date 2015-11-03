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

### Deleting a node

 - end point: `/node/delete/<id>/` where `<id>` is some integer
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

Root
----

### Viewing the list of tree roots

 - end point: `/root/get/`
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

 - end point: `/root/set/<id>/` where `<id>` is some integer
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

 - end point: `/root/delete/<id>/` where `<id>` is some integer
 - request: HTTP POST
 - data (input): None
 - return data:
```
{
  "message": "Successfully removed root label.",
  "id": "1"
}
```
