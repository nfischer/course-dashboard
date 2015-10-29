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

 - end point: `/nodes/tree/<id>` where `<id>` is some integer
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
  "message": "Successfully updated node 1"
}
```
 - Warning: this is not yet fully implemented. It will currently delete all
   links to child nodes and not reestablish them
