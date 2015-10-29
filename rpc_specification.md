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

 - end point: `/nodes`
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
  "message": "New node was successfully created"
}
```
 - Node ID will be auto-assigned (monotonically increasing)

### Accessing a node

 - end point: `/nodes/tree/<id>` where `<id>` is some integer
 - request: HTTP GET
 - data (input): none
 - return data:
```
{
  "children": {},
  "contents": "foo",
  "node_id": 1,
  "renderer": "bar"
}
```
 - No two nodes can have the same ID
 - If you request a non-existent node, you get an exception

### Editing a node

 - Still in progress
